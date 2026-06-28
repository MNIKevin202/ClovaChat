const net = require('net');
const tls = require('tls');

// Twitch sends a server PING roughly every 5 minutes to keep the connection
// alive. If we haven't seen any data (not even a PING) in this long, the
// socket is most likely a "zombie" connection — TCP never errored or closed,
// but the read side silently died (common after sleep/wake or network
// changes) — so chat looks "connected" forever while no new messages arrive.
const STALE_DATA_THRESHOLD_MS = 4 * 60 * 1000;
const STALE_PING_GRACE_MS = 20 * 1000;
const WATCHDOG_INTERVAL_MS = 30 * 1000;

class IrcManager {
  constructor({ onEvent }) {
    this.onEvent = onEvent;
    this.socket = null;
    this.buffer = '';
    this.config = null;
    this.channels = new Set();
    this.connected = false;
    this.lastDataAt = 0;
    this.livenessPingSentAt = 0;
    this.watchdogTimer = null;
  }

  connect(config) {
    this.disconnect();
    this.config = normalizeConfig(config);
    this.emit({ type: 'status', level: 'info', text: `Connecting to ${this.config.host}:${this.config.port}...` });

    const socketFactory = this.config.tls ? tls.connect : net.connect;
    const socket = socketFactory({
      host: this.config.host,
      port: this.config.port,
      rejectUnauthorized: false,
    });
    this.socket = socket;

    socket.setEncoding('utf8');
    this.lastDataAt = Date.now();
    this.livenessPingSentAt = 0;
    socket.on('connect', () => this.register());
    socket.on('secureConnect', () => this.register());
    socket.on('data', (chunk) => this.handleData(chunk));
    socket.on('error', (error) => {
      if (this.socket !== socket) return;
      this.emit({ type: 'status', level: 'error', text: error.message });
    });
    socket.on('close', () => {
      // A socket replaced by a watchdog-triggered reconnect closes
      // asynchronously after the new one is already in place — ignore stale
      // close events so they don't wipe the UI for a connection that's fine.
      if (this.socket !== socket) return;
      this.connected = false;
      this.stopWatchdog();
      this.emit({ type: 'disconnected', text: 'Disconnected.' });
    });

    this.startWatchdog();
    return { ok: true };
  }

  startWatchdog() {
    this.stopWatchdog();
    this.watchdogTimer = setInterval(() => this.checkConnectionLiveness(), WATCHDOG_INTERVAL_MS);
  }

  stopWatchdog() {
    if (this.watchdogTimer) clearInterval(this.watchdogTimer);
    this.watchdogTimer = null;
  }

  checkConnectionLiveness() {
    if (!this.socket || !this.connected) return;
    const idleFor = Date.now() - this.lastDataAt;
    if (this.livenessPingSentAt) {
      if (Date.now() - this.livenessPingSentAt > STALE_PING_GRACE_MS) {
        this.emit({ type: 'status', level: 'info', text: 'Connection looked stale, reconnecting...' });
        this.reconnect();
      }
      return;
    }
    if (idleFor > STALE_DATA_THRESHOLD_MS) {
      this.livenessPingSentAt = Date.now();
      this.raw('PING :clovachat-keepalive');
    }
  }

  reconnect() {
    if (!this.config) return;
    const channels = Array.from(this.channels);
    this.connect({ ...this.config, channels });
  }

  register() {
    if (this.connected || !this.socket) return;
    this.connected = true;
    const { nick, username, realName, password } = this.config.profile;

    if (this.config.isTwitch) {
      this.raw('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
    }
    if (password) this.raw(`PASS ${password}`);
    this.raw(`NICK ${nick}`);
    this.raw(`USER ${username} 0 * :${realName}`);

    this.emit({ type: 'connected', server: this.config.host });
  }

  joinConfiguredChannels() {
    this.config.channels.forEach((channel, index) => {
      setTimeout(() => this.join(channel), index * 350);
    });
  }

  disconnect() {
    this.stopWatchdog();
    const socket = this.socket;
    const wasConnected = this.connected;
    if (socket) {
      // Remove the 'close' listener before destroying: it checks
      // this.socket !== socket to ignore stale closes from a
      // watchdog-triggered reconnect, but that same check would also
      // swallow this intentional disconnect once this.socket is nulled
      // below (close fires asynchronously, after this method returns).
      socket.removeAllListeners('close');
      this.raw('QUIT :Leaving ClovaChat');
      socket.destroy();
    }
    this.socket = null;
    this.buffer = '';
    this.channels.clear();
    this.connected = false;
    if (wasConnected) this.emit({ type: 'disconnected', text: 'Disconnected.' });
    return { ok: true };
  }

  send(payload) {
    if (!this.socket || !this.connected) {
      this.emit({ type: 'status', level: 'error', text: 'Not connected.' });
      return { ok: false };
    }

    const target = payload.target || this.config.channel;
    const input = (payload.text || '').trimEnd();
    if (!input) return { ok: true };

    if (input.startsWith('/')) {
      this.handleCommand(input, target);
    } else if (target) {
      this.privmsg(target, input);
    }

    return { ok: true };
  }

  handleCommand(input, target) {
    const [commandName, ...rest] = input.slice(1).split(' ');
    const command = commandName.toLowerCase();
    const args = rest.join(' ');

    if (command === 'join') return this.join(args || target);
    if (command === 'part') return this.part(args || target);
    if (command === 'msg') {
      const [recipient, ...messageParts] = rest;
      return this.privmsg(recipient, messageParts.join(' '));
    }
    if (command === 'nick') return this.raw(`NICK ${args}`);
    if (command === 'me') return this.action(target, args);
    if (command === 'raw') return this.raw(args);
    if (command === 'disconnect' || command === 'quit') return this.disconnect();
    if (command === 'server') return this.emit({
      type: 'status',
      level: 'info',
      text: 'Use the connect form to open a new server connection.'
    });

    // Twitch implements moderation/utility commands (timeout, ban, unban,
    // clear, color, marker, etc.) by intercepting plain PRIVMSG text that
    // starts with "/" — there's no separate protocol command for them. Any
    // slash command we don't handle locally gets forwarded as-is so Twitch
    // can interpret it; Twitch replies with a NOTICE either way (success or
    // "Unrecognized command"), which already surfaces in the UI.
    if (this.config.isTwitch && target) {
      // Send directly over the wire (not via privmsg()) so the command itself
      // doesn't get echoed into the local chat log as if it were a message —
      // Twitch doesn't show these to anyone either, just replies with a NOTICE.
      this.raw(`PRIVMSG ${target} :${input}`);
      return;
    }

    this.emit({ type: 'unknown-command', command, args, target });
  }

  join(channel) {
    const normalized = normalizeChannel(channel);
    if (!normalized) return;
    this.channels.add(normalized);
    this.config.channel = normalized;
    this.raw(`JOIN ${normalized}`);
    if (!this.config.isTwitch) this.raw(`NAMES ${normalized}`);
  }

  part(channel) {
    const normalized = normalizeChannel(channel);
    if (!normalized) return;
    this.channels.delete(normalized);
    this.raw(`PART ${normalized}`);
  }

  privmsg(target, text) {
    if (!target || !text) return;
    this.raw(`PRIVMSG ${target} :${text}`);
    this.emit({
      type: 'message',
      direction: 'out',
      target,
      nick: this.config.profile.nick,
      text,
      twitchEmotes: [],
      timestamp: Date.now()
    });
  }

  action(target, text) {
    if (!target || !text) return;
    this.raw(`PRIVMSG ${target} :\u0001ACTION ${text}\u0001`);
    this.emit({
      type: 'action',
      direction: 'out',
      target,
      nick: this.config.profile.nick,
      text,
      twitchEmotes: [],
      timestamp: Date.now()
    });
  }

  raw(line) {
    if (!this.socket || !line) return;
    this.socket.write(`${line}\r\n`);
    this.emit({ type: 'raw-out', line, timestamp: Date.now() });
  }

  handleData(chunk) {
    this.lastDataAt = Date.now();
    this.livenessPingSentAt = 0;
    this.buffer += chunk;
    const lines = this.buffer.split(/\r?\n/);
    this.buffer = lines.pop() || '';
    lines.filter(Boolean).forEach((line) => this.handleLine(line));
  }

  handleLine(line) {
    this.emit({ type: 'raw-in', line, timestamp: Date.now() });
    const message = parseIrcLine(line);

    if (message.command === 'PING') {
      this.raw(`PONG ${message.trailing || message.params[0]}`);
      return;
    }

    if (message.command === '001') {
      this.emit({ type: 'status', level: 'success', text: 'Registered with server.' });
      this.joinConfiguredChannels();
      return;
    }

    if (message.command === 'JOIN') {
      const channel = message.trailing || message.params[0];
      const nick = nickFromPrefix(message.prefix);
      if (nick === this.config.profile.nick) this.channels.add(channel);
      this.emit({ type: 'join', channel, nick, timestamp: Date.now() });
      return;
    }

    if (message.command === 'PART') {
      const channel = message.params[0];
      this.emit({ type: 'part', channel, nick: nickFromPrefix(message.prefix), timestamp: Date.now() });
      return;
    }

    if (message.command === 'QUIT') {
      this.emit({ type: 'quit', nick: nickFromPrefix(message.prefix), timestamp: Date.now() });
      return;
    }

    if (message.command === 'ROOMSTATE') {
      const channel = message.params[0];
      this.emit({
        type: 'roomstate',
        channel,
        roomId: message.tags['room-id'] || '',
        timestamp: Date.now()
      });
      return;
    }

    if (message.command === 'NOTICE') {
      this.emit({
        type: 'notice',
        channel: message.params[0],
        text: message.trailing || '',
        timestamp: Date.now()
      });
      return;
    }

    if (message.command === 'USERSTATE') {
      const channel = message.params[0];
      const hasBadgeMetadata = Object.hasOwn(message.tags, 'badges');
      this.emit({
        type: 'userstate',
        channel,
        nick: message.tags['display-name'] || this.config.profile.nick,
        role: roleFromBadges(message.tags.badges || ''),
        roleKnown: hasBadgeMetadata,
        badges: message.tags.badges || '',
        timestamp: Date.now()
      });
      return;
    }

    if (message.command === '353') {
      const channel = message.params[2];
      const entries = (message.trailing || '')
        .split(/\s+/)
        .filter(Boolean)
        .map((raw) => {
          const prefixMatch = raw.match(/^([~&@%+])(.+)$/);
          if (!prefixMatch) return { nick: raw, role: '' };
          const [, prefix, nick] = prefixMatch;
          const role = prefix === '%' || prefix === '+' ? 'vip' : 'mod';
          return { nick, role };
        });
      this.emit({
        type: 'names',
        channel,
        nicks: entries.map((entry) => entry.nick),
        roles: entries.filter((entry) => entry.role),
        timestamp: Date.now()
      });
      return;
    }

    if (message.command === 'PRIVMSG') {
      const target = message.params[0];
      const text = message.trailing || '';
      const nick = message.tags['display-name'] || nickFromPrefix(message.prefix);
      const action = text.match(/^\u0001ACTION (.*)\u0001$/);
      const displayText = action ? action[1] : text;
      const role = roleFromBadges(message.tags.badges || '');
      const hasBadgeMetadata = Object.hasOwn(message.tags, 'badges');
      this.emit({
        type: action ? 'action' : 'message',
        direction: 'in',
        target,
        nick,
        role,
        roleKnown: hasBadgeMetadata,
        badges: message.tags.badges || '',
        text: displayText,
        twitchEmotes: parseTwitchEmotes(message.tags.emotes || '', displayText),
        timestamp: Date.now()
      });
      return;
    }

    if (/^[45]\d\d$/.test(message.command)) {
      this.emit({
        type: 'status',
        level: 'error',
        text: `${message.command}: ${message.trailing || message.params.join(' ')}`
      });
      return;
    }

    if (/^[23]\d\d$/.test(message.command)) {
      this.emit({
        type: 'status',
        level: 'info',
        text: message.trailing || message.params.join(' ')
      });
    }
  }

  emit(event) {
    this.onEvent({ ...event, id: `${Date.now()}-${Math.random().toString(16).slice(2)}` });
  }
}

function normalizeConfig(config) {
  const host = config.host || 'irc.libera.chat';
  const port = Number(config.port || (config.tls ? 6697 : 6667));
  const nick = config.nick || 'ClovaChatUser';
  const isTwitch = host.toLowerCase().includes('twitch.tv');

  return {
    host,
    port,
    tls: Boolean(config.tls),
    channel: normalizeChannel(config.channel),
    channels: uniqueChannels([config.channel, ...(config.channels || [])]),
    isTwitch,
    profile: {
      nick,
      username: config.username || nick,
      realName: config.realName || nick,
      password: config.password || '',
    }
  };
}

function uniqueChannels(channels) {
  const seen = new Set();
  return channels
    .map(normalizeChannel)
    .filter(Boolean)
    .filter((channel) => {
      const key = channel.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function roleFromBadges(badges) {
  const badgeNames = badges
    .split(',')
    .map((badge) => badge.split('/')[0].toLowerCase().replaceAll('-', '_'));
  if (badgeNames.some((badge) => (
    ['moderator', 'broadcaster', 'global_mod', 'admin', 'staff', 'lead_moderator'].includes(badge)
    || badge.includes('moderator')
    || badge.endsWith('_mod')
  ))) return 'mod';
  if (badgeNames.includes('vip')) return 'vip';
  return '';
}

function normalizeChannel(channel) {
  if (!channel) return '';
  const trimmed = channel.trim();
  if (!trimmed) return '';
  return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
}

function nickFromPrefix(prefix = '') {
  return prefix.split('!')[0] || prefix;
}

function parseIrcLine(line) {
  let rest = line;
  let tags = {};
  let prefix = '';
  let trailing = '';
  const params = [];

  if (rest.startsWith('@')) {
    const space = rest.indexOf(' ');
    tags = parseTags(rest.slice(1, space));
    rest = rest.slice(space + 1);
  }

  if (rest.startsWith(':')) {
    const space = rest.indexOf(' ');
    prefix = rest.slice(1, space);
    rest = rest.slice(space + 1);
  }

  const trailingIndex = rest.indexOf(' :');
  if (trailingIndex >= 0) {
    trailing = rest.slice(trailingIndex + 2);
    rest = rest.slice(0, trailingIndex);
  }

  const parts = rest.split(' ').filter(Boolean);
  const command = (parts.shift() || '').toUpperCase();
  params.push(...parts);

  return { tags, prefix, command, params, trailing };
}

function parseTags(rawTags) {
  return rawTags.split(';').reduce((tags, pair) => {
    const [key, value = ''] = pair.split('=');
    tags[key] = value
      .replace(/\\s/g, ' ')
      .replace(/\\:/g, ';')
      .replace(/\\\\/g, '\\');
    return tags;
  }, {});
}

function parseTwitchEmotes(rawEmotes, text) {
  if (!rawEmotes || !text) return [];

  return rawEmotes
    .split('/')
    .flatMap((entry) => {
      const [id, ranges = ''] = entry.split(':');
      if (!id || !ranges) return [];
      return ranges.split(',').map((range) => {
        const [start, end] = range.split('-').map((value) => Number(value));
        if (!Number.isInteger(start) || !Number.isInteger(end) || start < 0 || end < start) return null;
        const stringRange = codePointRangeToStringRange(text, start, end);
        if (!stringRange) return null;
        const name = text.slice(stringRange.start, stringRange.end + 1);
        if (!name) return null;
        return { id, start: stringRange.start, end: stringRange.end, name };
      });
    })
    .filter(Boolean)
    .sort((first, second) => first.start - second.start || first.end - second.end);
}

function codePointRangeToStringRange(text, start, end) {
  const indexes = [];
  for (let stringIndex = 0; stringIndex < text.length;) {
    indexes.push(stringIndex);
    const codePoint = text.codePointAt(stringIndex);
    stringIndex += codePoint > 0xffff ? 2 : 1;
  }

  if (start >= indexes.length || end >= indexes.length) return null;
  const nextIndex = indexes[end + 1] ?? text.length;
  return {
    start: indexes[start],
    end: nextIndex - 1,
  };
}

module.exports = { IrcManager, parseIrcLine, parseTwitchEmotes };
