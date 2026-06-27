const state = {
  settings: null,
  activeChannel: '',
  channels: [],
  unreadChannels: new Set(),
  messagesByTarget: new Map(),
  rosters: new Map(),
  roleMemory: new Map(),
  sevenTv: {
    emotesByChannel: new Map(),
    loadingChannels: new Set(),
    roomIdsByChannel: new Map(),
  },
  recentChatters: [],
  nickSuggestion: '',
  timerHandles: new Map(),
  timerExpiryHandles: new Map(),
  timerNextFire: new Map(),
  timerPillTickHandle: null,
  streamPlayer: null,
  streamPlayerChannel: '',
  connected: false,
  autoConnectStarted: false,
  monitored: new Map(),
  hiddenNicks: new Map(),
  twitchClientId: '',
  twitchUserId: '',
  twitchRoster: {
    loadingChannels: new Set(),
    unavailableChannels: new Set(),
  },
  liveChannels: new Set(),
  livePollHandle: null,
  draggedChannel: '',
};

const el = {
  connectionStatus: document.querySelector('#connectionStatus'),
  connectionState: document.querySelector('#connectionState'),
  connectionServer: document.querySelector('#connectionServer'),
  connectionNick: document.querySelector('#connectionNick'),
  connectionChannelCount: document.querySelector('#connectionChannelCount'),
  openLogFolderButton: document.querySelector('#openLogFolderButton'),
  host: document.querySelector('#host'),
  port: document.querySelector('#port'),
  tls: document.querySelector('#tls'),
  nick: document.querySelector('#nick'),
  password: document.querySelector('#password'),
  channel: document.querySelector('#channel'),
  darkModeToggle: document.querySelector('#darkModeToggle'),
  sevenTvToggle: document.querySelector('#sevenTvToggle'),
  connectOnOpenToggle: document.querySelector('#connectOnOpenToggle'),
  streamSidebarButton: document.querySelector('#streamSidebarButton'),
  streamPanel: document.querySelector('#streamPanel'),
  streamTitle: document.querySelector('#streamTitle'),
  streamPlayer: document.querySelector('#streamPlayer'),
  streamPreviousButton: document.querySelector('#streamPreviousButton'),
  streamNextButton: document.querySelector('#streamNextButton'),
  streamPlayButton: document.querySelector('#streamPlayButton'),
  streamMuteButton: document.querySelector('#streamMuteButton'),
  streamToggleButton: document.querySelector('#streamToggleButton'),
  streamResizeHandle: document.querySelector('#streamResizeHandle'),
  autoJoinList: document.querySelector('#autoJoinList'),
  autoJoinForm: document.querySelector('#autoJoinForm'),
  autoJoinChannel: document.querySelector('#autoJoinChannel'),
  twitchPresetButton: document.querySelector('#twitchPresetButton'),
  twitchTokenButton: document.querySelector('#twitchTokenButton'),
  connectButton: document.querySelector('#connectButton'),
  disconnectButton: document.querySelector('#disconnectButton'),
  chatTab: document.querySelector('#chatTab'),
  channels: document.querySelector('#channels'),
  topicBar: document.querySelector('#topicBar'),
  channelStatusStrip: document.querySelector('#channelStatusStrip'),
  messages: document.querySelector('#messages'),
  chatBody: document.querySelector('.chat-body'),
  rosterPanel: document.querySelector('.roster-panel'),
  roster: document.querySelector('#roster'),
  rosterCount: document.querySelector('#rosterCount'),
  popupBar: document.querySelector('#popupBar'),
  chatActionBar: document.querySelector('.chat-action-bar'),
  addAutoJoinCurrentButton: document.querySelector('#addAutoJoinCurrentButton'),
  inputForm: document.querySelector('#inputForm'),
  messageInput: document.querySelector('#messageInput'),
  nickSuggest: document.querySelector('#nickSuggest'),
  aliasList: document.querySelector('#aliasList'),
  aliasForm: document.querySelector('#aliasForm'),
  aliasName: document.querySelector('#aliasName'),
  aliasMode: document.querySelector('#aliasMode'),
  aliasOutput: document.querySelector('#aliasOutput'),
  botRuleList: document.querySelector('#botRuleList'),
  botRuleForm: document.querySelector('#botRuleForm'),
  botIntentInput: document.querySelector('#botIntentInput'),
  botWizardButton: document.querySelector('#botWizardButton'),
  botWizardPreview: document.querySelector('#botWizardPreview'),
  botRuleName: document.querySelector('#botRuleName'),
  botChannelScope: document.querySelector('#botChannelScope'),
  botSpecificChannel: document.querySelector('#botSpecificChannel'),
  botSpecificChannelLabel: document.querySelector('#botSpecificChannelLabel'),
  botTriggerType: document.querySelector('#botTriggerType'),
  botTriggerValue: document.querySelector('#botTriggerValue'),
  botResponseType: document.querySelector('#botResponseType'),
  botResponse: document.querySelector('#botResponse'),
  timerList: document.querySelector('#timerList'),
  timerForm: document.querySelector('#timerForm'),
  timerChannel: document.querySelector('#timerChannel'),
  timerMinutes: document.querySelector('#timerMinutes'),
  timerSeconds: document.querySelector('#timerSeconds'),
  timerMessage: document.querySelector('#timerMessage'),
  timerExpireDays: document.querySelector('#timerExpireDays'),
  timerExpireHours: document.querySelector('#timerExpireHours'),
  timerExpireMinutes: document.querySelector('#timerExpireMinutes'),
  timerShowOnChannel: document.querySelector('#timerShowOnChannel'),
  timerPills: document.querySelector('#timerPills'),
  popupList: document.querySelector('#popupList'),
  popupForm: document.querySelector('#popupForm'),
  popupLabel: document.querySelector('#popupLabel'),
  popupCommand: document.querySelector('#popupCommand'),
  rawLog: document.querySelector('#rawLog'),
  chatHistoryToggle: document.querySelector('#chatHistoryToggle'),
  clearHistoryButton: document.querySelector('#clearHistoryButton'),
  channelLogToggle: document.querySelector('#channelLogToggle'),
  channelLogFolder: document.querySelector('#channelLogFolder'),
  channelLogFolderButton: document.querySelector('#channelLogFolderButton'),
  mentionNotifyToggle: document.querySelector('#mentionNotifyToggle'),
  liveNotifyToggle: document.querySelector('#liveNotifyToggle'),
  liveTabSortToggle: document.querySelector('#liveTabSortToggle'),
  exportSettingsButton: document.querySelector('#exportSettingsButton'),
  importSettingsButton: document.querySelector('#importSettingsButton'),
  sidebarVersion: document.querySelector('#sidebarVersion'),
  appVersion: document.querySelector('#appVersion'),
  updateStatus: document.querySelector('#updateStatus'),
  checkUpdatesButton: document.querySelector('#checkUpdatesButton'),
};

init();

async function init() {
  state.settings = await window.macIRC.getSettings();
  ensureSettingsShape();
  hydrateSettings();
  bindEvents();
  renderAll();
  window.macIRC.onIrcEvent(handleIrcEvent);
  await loadChatHistory();
  loadAppVersion();
  setTimeout(() => checkForUpdates({ silent: true }), 1800);
}

async function loadChatHistory() {
  if (!state.settings.preferences.chatHistoryEnabled) return;
  const history = await window.macIRC.getHistory();
  Object.entries(history || {}).forEach(([channel, messages]) => {
    state.messagesByTarget.set(channel, messages);
  });
  if (migrateLegacyStatusEntries()) scheduleHistorySave();
  renderMessages();
}

function migrateLegacyStatusEntries() {
  let migrated = false;
  const serverList = state.messagesByTarget.get('server') || [];

  // Earlier builds stored "server" status lines (joins, NAMES replies, 7TV load
  // results, etc.) under whichever channel was active, and a routing bug also
  // sent some into a literal "#server" bucket. Sweep those into "server" once.
  const legacyServerBucket = state.messagesByTarget.get('#server');
  if (legacyServerBucket?.length) {
    serverList.push(...legacyServerBucket);
    state.messagesByTarget.delete('#server');
    migrated = true;
  }

  for (const [channel, messages] of state.messagesByTarget.entries()) {
    if (channel === 'server') continue;
    const stray = messages.filter((entry) => entry.kind === 'status');
    if (stray.length === 0) continue;
    state.messagesByTarget.set(channel, messages.filter((entry) => entry.kind !== 'status'));
    serverList.push(...stray);
    migrated = true;
  }

  if (migrated) {
    serverList.sort((a, b) => a.timestamp - b.timestamp);
    state.messagesByTarget.set('server', serverList);
  }
  return migrated;
}

async function loadAppVersion() {
  const version = await window.macIRC.getVersion();
  const label = `ClovaChat v${version}`;
  el.sidebarVersion.textContent = label;
  el.appVersion.textContent = label;
}

async function checkForUpdates({ silent = false } = {}) {
  el.checkUpdatesButton.disabled = true;
  if (!silent) el.updateStatus.textContent = 'Checking GitHub for updates...';

  const result = await window.macIRC.checkForUpdates();
  el.checkUpdatesButton.disabled = false;

  if (!result.ok) {
    if (!silent) el.updateStatus.textContent = `Could not check updates: ${result.error}`;
    return;
  }

  if (!result.updateAvailable) {
    if (!silent) el.updateStatus.textContent = `You're up to date on ClovaChat v${result.currentVersion}.`;
    return;
  }

  if (!result.asset?.url) {
    const message = `ClovaChat v${result.latestVersion} is available, but no installer was attached for this computer.`;
    el.updateStatus.textContent = message;
    if (!silent) appendStatus(message, 'error');
    return;
  }

  el.updateStatus.textContent = `ClovaChat v${result.latestVersion} is available.`;
  const wantsUpdate = window.confirm(
    `ClovaChat v${result.latestVersion} is available.\n\nDownload and open the installer now? ClovaChat will close after the installer opens.`
  );
  if (!wantsUpdate) return;

  await downloadAndInstallUpdate(result.asset);
}

async function downloadAndInstallUpdate(asset) {
  el.checkUpdatesButton.disabled = true;
  el.updateStatus.textContent = `Downloading ${asset.name}...`;
  const result = await window.macIRC.downloadAndInstallUpdate(asset);
  el.checkUpdatesButton.disabled = false;
  if (!result.ok) {
    el.updateStatus.textContent = `Update download failed: ${result.error}`;
    appendStatus(`Update download failed: ${result.error}`, 'error');
    return;
  }
  if (result.opened) {
    el.updateStatus.textContent = `Installer opened from ${result.path}. Finish the installer to update ClovaChat.`;
    return;
  }
  el.updateStatus.textContent = `Downloaded to ${result.path}, but couldn't open it automatically (${result.openError || 'unknown error'}). Finder is showing the file — open it from there to install.`;
  appendStatus(`Update opener failed: ${result.openError || 'unknown error'}`, 'error');
}

function ensureSettingsShape() {
  state.settings.appearance ||= {};
  state.settings.appearance.theme ||= 'light';
  state.settings.appearance.sevenTvEmotes ??= true;
  state.settings.appearance.twitchPlayer ??= false;
  state.settings.appearance.twitchPlayerWidth ??= 420;
  state.settings.appearance.twitchPlayerChannel ||= '';
  state.settings.appearance.twitchPlayerStates ||= {};
  state.settings.connection ||= {};
  state.settings.connection.connectOnOpen ??= false;
  state.settings.connection.autoJoinChannels ||= [];
  state.settings.connection.autoJoinChannels = state.settings.connection.autoJoinChannels
    .filter((channel) => !isServerTarget(channel));
  state.settings.connection.channelOrder ||= [];
  state.settings.aliases ||= [];
  state.settings.botRules ||= [];
  state.settings.popups ||= [];
  state.settings.timedMessages ||= [];
  state.settings.preferences ||= {};
  state.settings.preferences.chatHistoryEnabled ??= true;
  state.settings.preferences.channelLogging ??= false;
  state.settings.preferences.channelLogFolder ??= '';
  state.settings.preferences.notifyOnMention ??= false;
  state.settings.preferences.notifyOnLive ??= false;
  state.settings.preferences.moveLiveTabsToFront ??= true;
  state.settings.preferences.hiddenChats ||= {};
  state.settings.preferences.roleMemory ||= {};
  migrateDefaultScripts();
  loadHiddenChats();
  loadRoleMemory();
}

function loadHiddenChats() {
  state.hiddenNicks.clear();
  Object.entries(state.settings.preferences.hiddenChats).forEach(([channel, nicks]) => {
    state.hiddenNicks.set(channel, new Set(nicks));
  });
}

async function persistHiddenChats() {
  const hiddenChats = {};
  state.hiddenNicks.forEach((nicks, channel) => {
    if (nicks.size > 0) hiddenChats[channel] = Array.from(nicks);
  });
  state.settings.preferences.hiddenChats = hiddenChats;
  await saveSettings();
}

function loadRoleMemory() {
  state.roleMemory.clear();
  Object.entries(state.settings.preferences.roleMemory || {}).forEach(([channel, users]) => {
    const normalized = normalizeChannel(channel);
    if (!normalized || !users || typeof users !== 'object') return;
    const roles = new Map();
    Object.entries(users).forEach(([nick, role]) => {
      if (!isRememberedRole(role)) return;
      roles.set(nick.toLowerCase(), { nick, role });
    });
    if (roles.size > 0) state.roleMemory.set(normalized, roles);
  });
}

let roleMemorySaveTimer = null;

function scheduleRoleMemorySave() {
  clearTimeout(roleMemorySaveTimer);
  roleMemorySaveTimer = setTimeout(async () => {
    const roleMemory = {};
    state.roleMemory.forEach((users, channel) => {
      const snapshot = {};
      users.forEach((user) => {
        if (isRememberedRole(user.role)) snapshot[user.nick] = user.role;
      });
      if (Object.keys(snapshot).length > 0) roleMemory[channel] = snapshot;
    });
    state.settings.preferences.roleMemory = roleMemory;
    await saveSettings();
  }, 800);
}

function migrateDefaultScripts() {
  state.settings.aliases = state.settings.aliases.map((alias) => {
    if (alias.name === 'hello' && alias.output === 'PRIVMSG $channel :Hello from macIRC.') {
      return { ...alias, output: 'Hello from macIRC.' };
    }
    if (alias.name === 'lurk' && alias.output === 'PRIVMSG $channel :I am lurking for a bit.') {
      return { ...alias, output: 'I am lurking for a bit.' };
    }
    return { ...alias, type: alias.type || 'mirc' };
  });

  state.settings.popups = state.settings.popups.map((popup) => {
    if (popup.label === 'Wave' && (popup.command === '/me waves' || popup.command === '/wave')) {
      return { ...popup, command: '👋' };
    }
    if (popup.label === 'Say hello' && popup.command === '/hello') {
      return { ...popup, command: 'Hello' };
    }
    return popup;
  });
}

function hydrateSettings() {
  const profile = state.settings.profile;
  const quick = state.settings.quickConnect;
  el.host.value = quick.host;
  el.port.value = quick.port;
  el.tls.checked = quick.tls;
  el.nick.value = profile.nick;
  el.password.value = profile.password;
  el.channel.value = quick.channel;
  el.darkModeToggle.checked = state.settings.appearance.theme === 'dark';
  el.sevenTvToggle.checked = state.settings.appearance.sevenTvEmotes;
  el.connectOnOpenToggle.checked = state.settings.connection.connectOnOpen;
  el.chatHistoryToggle.checked = state.settings.preferences.chatHistoryEnabled;
  el.channelLogToggle.checked = state.settings.preferences.channelLogging;
  el.mentionNotifyToggle.checked = state.settings.preferences.notifyOnMention;
  el.liveNotifyToggle.checked = state.settings.preferences.notifyOnLive;
  el.liveTabSortToggle.checked = state.settings.preferences.moveLiveTabsToFront;
  updateChannelLogFolderLabel();
  applyTheme(state.settings.appearance.theme);
  state.activeChannel = quick.channel;
}

function updateChannelLogFolderLabel() {
  el.channelLogFolder.textContent = state.settings.preferences.channelLogFolder
    ? `Logging to ${state.settings.preferences.channelLogFolder}`
    : 'No folder selected.';
}

function bindEvents() {
  window.addEventListener('beforeunload', saveCurrentStreamPlayerState);
  window.addEventListener('pointerdown', (event) => {
    if (state.activeContextMenu && !state.activeContextMenu.contains(event.target)) hideContextMenu();
  });
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hideContextMenu();
  });
  window.addEventListener('blur', hideContextMenu);

  document.querySelectorAll('.tab').forEach((button) => {
    button.addEventListener('click', () => activateTab(button.dataset.tab));
  });

  el.connectButton.addEventListener('click', connect);
  el.disconnectButton.addEventListener('click', disconnect);
  el.twitchPresetButton.addEventListener('click', applyTwitchPreset);
  el.twitchTokenButton.addEventListener('click', openTwitchTokenPage);
  el.darkModeToggle.addEventListener('change', async () => {
    state.settings.appearance.theme = el.darkModeToggle.checked ? 'dark' : 'light';
    applyTheme(state.settings.appearance.theme);
    await saveSettings();
  });
  el.sevenTvToggle.addEventListener('change', async () => {
    state.settings.appearance.sevenTvEmotes = el.sevenTvToggle.checked;
    await saveSettings();
    if (state.settings.appearance.sevenTvEmotes) {
      state.sevenTv.roomIdsByChannel.forEach((roomId, channel) => loadSevenTvEmotes(channel, roomId));
    }
    renderMessages();
  });
  el.connectOnOpenToggle.addEventListener('change', async () => {
    state.settings.connection.connectOnOpen = el.connectOnOpenToggle.checked;
    await saveSettings();
  });
  el.chatHistoryToggle.addEventListener('change', async () => {
    state.settings.preferences.chatHistoryEnabled = el.chatHistoryToggle.checked;
    await saveSettings();
    if (!state.settings.preferences.chatHistoryEnabled) await window.macIRC.clearHistory();
  });
  el.clearHistoryButton.addEventListener('click', async () => {
    state.messagesByTarget.clear();
    await window.macIRC.clearHistory();
    renderMessages();
    appendStatus('Cleared saved chat history.', 'info');
  });
  el.channelLogToggle.addEventListener('change', async () => {
    if (el.channelLogToggle.checked && !state.settings.preferences.channelLogFolder) {
      const result = await window.macIRC.chooseLogFolder();
      if (!result.ok) {
        el.channelLogToggle.checked = false;
        return;
      }
      state.settings.preferences.channelLogFolder = result.path;
    }
    state.settings.preferences.channelLogging = el.channelLogToggle.checked;
    await saveSettings();
    updateChannelLogFolderLabel();
    appendStatus(
      state.settings.preferences.channelLogging
        ? `Logging channels to ${state.settings.preferences.channelLogFolder}`
        : 'Stopped logging channels.',
      'info'
    );
  });
  el.channelLogFolderButton.addEventListener('click', async () => {
    const result = await window.macIRC.chooseLogFolder();
    if (!result.ok) return;
    state.settings.preferences.channelLogFolder = result.path;
    await saveSettings();
    updateChannelLogFolderLabel();
    renderConnectionCard();
  });
  el.openLogFolderButton.addEventListener('click', () => {
    const folder = state.settings.preferences.channelLogFolder;
    if (folder) window.macIRC.openLogFolder(folder);
  });
  el.mentionNotifyToggle.addEventListener('change', async () => {
    state.settings.preferences.notifyOnMention = el.mentionNotifyToggle.checked;
    await saveSettings();
    if (state.settings.preferences.notifyOnMention && 'Notification' in window) {
      Notification.requestPermission();
    }
  });
  el.liveNotifyToggle.addEventListener('change', async () => {
    state.settings.preferences.notifyOnLive = el.liveNotifyToggle.checked;
    await saveSettings();
    if (state.settings.preferences.notifyOnLive && 'Notification' in window) {
      Notification.requestPermission();
    }
    scheduleLivePolling();
  });
  el.liveTabSortToggle.addEventListener('change', async () => {
    state.settings.preferences.moveLiveTabsToFront = el.liveTabSortToggle.checked;
    await saveSettings();
    scheduleLivePolling();
    renderChannels();
  });
  el.exportSettingsButton.addEventListener('click', async () => {
    const result = await window.macIRC.exportSettings();
    if (result.ok) appendStatus(`Settings backed up to ${result.path}`, 'info');
  });
  el.importSettingsButton.addEventListener('click', async () => {
    const result = await window.macIRC.importSettings();
    if (!result.ok) return;
    state.settings = result.settings;
    ensureSettingsShape();
    hydrateSettings();
    renderAll();
    appendStatus('Settings imported. Reconnect to apply server changes.', 'info');
  });
  el.checkUpdatesButton.addEventListener('click', async () => {
    await checkForUpdates({ silent: false });
  });
  el.streamToggleButton.addEventListener('click', async () => {
    saveCurrentStreamPlayerState();
    state.settings.appearance.twitchPlayer = false;
    state.settings.appearance.twitchPlayerChannel = '';
    await saveSettings();
    renderStreamPlayer();
  });
  el.streamSidebarButton.addEventListener('click', async () => {
    if (state.settings.appearance.twitchPlayer) saveCurrentStreamPlayerState();
    const nextEnabled = !state.settings.appearance.twitchPlayer;
    const nextChannel = streamChannelFromActiveChannel();
    if (nextEnabled && !nextChannel) {
      appendStatus('Switch to a channel tab before opening the stream player.', 'error');
      return;
    }
    state.settings.appearance.twitchPlayer = nextEnabled;
    if (nextEnabled) state.settings.appearance.twitchPlayerChannel = nextChannel;
    else state.settings.appearance.twitchPlayerChannel = '';
    await saveSettings();
    renderStreamPlayer();
  });
  el.streamPreviousButton.addEventListener('click', () => navigateStream(-1));
  el.streamNextButton.addEventListener('click', () => navigateStream(1));
  el.streamPlayButton.addEventListener('click', toggleStreamPlayback);
  el.streamMuteButton.addEventListener('click', toggleStreamMute);
  el.streamResizeHandle?.addEventListener('pointerdown', startStreamResize);

  el.autoJoinForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const channel = normalizeChannel(el.autoJoinChannel.value);
    if (!channel || isServerTarget(channel)) return;
    state.settings.connection.autoJoinChannels = uniqueChannels([
      ...state.settings.connection.autoJoinChannels,
      channel,
    ]);
    el.autoJoinChannel.value = '';
    await saveSettings();
    renderAutoJoinChannels();
    renderChatActions();
    if (state.connected) window.macIRC.send({ target: channel, text: `/join ${channel}` });
  });

  el.addAutoJoinCurrentButton.addEventListener('click', async () => {
    const channel = normalizeChannel(state.activeChannel);
    if (!channel || isServerTarget(channel) || channelIsAutoJoined(channel)) return;
    state.settings.connection.autoJoinChannels = uniqueChannels([
      ...state.settings.connection.autoJoinChannels,
      channel,
    ]);
    await saveSettings();
    renderAutoJoinChannels();
    renderChatActions();
  });

  el.inputForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = el.messageInput.value;
    el.messageInput.value = '';
    hideNickSuggestion();
    runInput(input);
  });

  el.messageInput.addEventListener('input', updateNickSuggestion);
  el.messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Tab' && state.nickSuggestion) {
      event.preventDefault();
      applyNickSuggestion();
    }

    if (event.key === 'Escape') hideNickSuggestion();
  });

  el.aliasForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = normalizeCommandName(el.aliasName.value);
    const type = el.aliasMode.value === 'python' ? 'python' : 'mirc';
    const output = el.aliasOutput.value.trim();
    if (!name || !output) return;
    state.settings.aliases = state.settings.aliases.filter((alias) => alias.name !== name);
    state.settings.aliases.push({ name, type, output });
    el.aliasName.value = '';
    el.aliasMode.value = 'mirc';
    el.aliasOutput.value = '';
    await saveSettings();
    renderAliases();
  });

  el.botTriggerType.addEventListener('change', updateBotTriggerInput);
  el.botResponseType.addEventListener('change', updateBotResponsePlaceholder);
  el.botChannelScope.addEventListener('change', updateBotChannelScope);
  el.botWizardButton.addEventListener('click', applyBotWizardIntent);
  el.botRuleForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const triggerType = el.botTriggerType.value;
    const triggerValue = normalizeBotTriggerValue(triggerType, el.botTriggerValue.value);
    const responseType = el.botResponseType.value === 'python' ? 'python' : 'reply';
    const response = el.botResponse.value.trim();
    const channelScope = botRuleChannelScope();
    if (triggerType !== 'any' && !triggerValue) return;
    if (!response) return;
    if (channelScope.type === 'specific' && channelScope.channels.length === 0) return;

    state.settings.botRules.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: el.botRuleName.value.trim() || botRuleFallbackName(triggerType, triggerValue),
      enabled: true,
      channelScope: channelScope.type,
      channel: channelScope.channel,
      channels: channelScope.channels,
      triggerType,
      triggerValue,
      responseType,
      response,
    });

    el.botRuleName.value = '';
    el.botTriggerType.value = 'command';
    el.botTriggerValue.value = '';
    el.botResponseType.value = 'reply';
    el.botResponse.value = '';
    el.botChannelScope.value = 'all';
    el.botSpecificChannel.value = '';
    updateBotTriggerInput();
    updateBotResponsePlaceholder();
    updateBotChannelScope();
    await saveSettings();
    renderBotRules();
  });

  el.timerForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const channel = normalizeChannel(el.timerChannel.value || state.activeChannel);
    const minutes = Math.max(0, Number(el.timerMinutes.value || 0));
    const seconds = Math.min(59, Math.max(0, Number(el.timerSeconds.value || 0)));
    const totalSeconds = (minutes * 60) + seconds;
    const message = el.timerMessage.value.trim();
    if (!channel || !message || totalSeconds < 1) return;

    const expireDays = Math.max(0, Number(el.timerExpireDays.value || 0));
    const expireHours = Math.max(0, Number(el.timerExpireHours.value || 0));
    const expireMinutes = Math.max(0, Number(el.timerExpireMinutes.value || 0));
    const expireMs = ((expireDays * 24 * 60 * 60) + (expireHours * 60 * 60) + (expireMinutes * 60)) * 1000;

    const newTimer = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      channel,
      minutes,
      seconds,
      message,
      enabled: true,
      expiresAt: expireMs > 0 ? Date.now() + expireMs : null,
      showOnChannel: el.timerShowOnChannel.checked,
    };
    state.settings.timedMessages.push(newTimer);

    el.timerMinutes.value = '10';
    el.timerSeconds.value = '0';
    el.timerMessage.value = '';
    el.timerExpireDays.value = '0';
    el.timerExpireHours.value = '0';
    el.timerExpireMinutes.value = '0';
    el.timerShowOnChannel.checked = false;
    await saveSettings();
    renderTimers();
    scheduleTimer(newTimer);
    renderTimerPills();
  });

  el.popupForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const label = el.popupLabel.value.trim();
    const command = el.popupCommand.value.trim();
    if (!label || !command) return;
    state.settings.popups.push({ label, command });
    el.popupLabel.value = '';
    el.popupCommand.value = '';
    await saveSettings();
    renderPopups();
  });
}

function applyTwitchPreset() {
  el.host.value = 'irc.chat.twitch.tv';
  el.port.value = '6697';
  el.tls.checked = true;
  if (!el.channel.value.trim()) el.channel.value = '#channelname';
  appendStatus('Twitch preset applied. Use your Twitch username as nick and paste an oauth: token as the password.', 'info');
}

async function openTwitchTokenPage() {
  applyTwitchPreset();
  await window.macIRC.openExternal('https://twitchtokengenerator.com/');
  appendStatus('Opened Twitch Token Generator in your browser. Choose chat:read, chat:edit, and moderator:read:chatters for automatic rosters, then paste the token here with oauth: at the front.', 'info');
}

async function connect() {
  const config = formConfig();
  state.settings.profile.nick = config.nick;
  state.settings.profile.username = config.username;
  state.settings.profile.realName = config.realName;
  state.settings.profile.password = config.password;
  state.settings.quickConnect = {
    host: config.host,
    port: config.port,
    tls: config.tls,
    channel: config.channel,
  };
  state.settings.connection.autoJoinChannels = uniqueChannels(state.settings.connection.autoJoinChannels);
  state.activeChannel = normalizeChannel(config.channel);
  await saveSettings();
  await window.macIRC.connect(config);
}

async function disconnect() {
  await window.macIRC.disconnect();
}

function formConfig() {
  const nick = el.nick.value.trim() || 'ClovaChatUser';
  return {
    host: el.host.value.trim() || 'irc.libera.chat',
    port: Number(el.port.value || (el.tls.checked ? 6697 : 6667)),
    tls: el.tls.checked,
    nick,
    username: nick,
    realName: `${nick} via ClovaChat`,
    password: el.password.value.trim(),
    channel: normalizeChannel(el.channel.value),
    channels: uniqueChannels(state.settings.connection.autoJoinChannels),
  };
}

async function saveSettings() {
  state.settings = await window.macIRC.setSettings(state.settings);
}

function renderConnectionCard() {
  el.connectionServer.textContent = state.connected ? state.settings.quickConnect.host : '—';
  el.connectionNick.textContent = state.settings.profile.nick || '—';
  const count = state.channels.length;
  el.connectionChannelCount.textContent = `${count} joined`;

  const folder = state.settings.preferences.channelLogFolder;
  el.openLogFolderButton.hidden = !folder;
}

function applyTheme(theme) {
  document.body.dataset.theme = theme === 'dark' ? 'dark' : 'light';
}

function handleIrcEvent(event) {
  if (event.type === 'connected') {
    state.connected = true;
    el.connectionState.textContent = `Connected to ${event.server}`;
    el.connectionStatus.classList.add('connected');
    el.connectionStatus.classList.remove('disconnected');
    renderConnectionCard();
    appendStatus('Connected.', 'success');
    scheduleAllTimers();
    setupLiveNotifications(event.server);
  }

  if (event.type === 'disconnected') {
    state.connected = false;
    state.channels = [];
    state.activeChannel = normalizeChannel(el.channel.value);
    state.rosters.clear();
    state.messagesByTarget.clear();
    state.recentChatters = [];
    clearTimerHandles();
    stopLivePolling();
    clearStreamPlayer();
    el.connectionState.textContent = 'Offline';
    el.connectionStatus.classList.remove('connected');
    el.connectionStatus.classList.add('disconnected');
    appendStatus(event.text || 'Disconnected.');
    renderChannels();
    renderMessages();
    renderRoster();
    renderStreamPlayer();
    hideNickSuggestion();
  }

  if (event.type === 'status') {
    appendStatus(event.text, event.level);
  }

  if (event.type === 'join') {
    addChannel(event.channel);
    addRosterUser(event.channel, event.nick, event.role, { roleKnown: Boolean(event.role) });
    rememberChatter(event.nick);
    appendStatus(`${event.nick} joined ${event.channel}.`, 'info');
  }

  if (event.type === 'part') {
    if (nickMatchesSelf(event.nick)) removeJoinedChannel(event.channel);
    removeRosterUser(event.channel, event.nick);
    appendStatus(`${event.nick} left ${event.channel}.`, 'info');
  }

  if (event.type === 'quit') {
    removeRosterUserFromAllChannels(event.nick);
  }

  if (event.type === 'names') {
    addChannel(event.channel);
    setRosterUsers(event.channel, event.nicks);
    (event.roles || []).forEach(({ nick, role }) => addRosterUser(event.channel, nick, role, { roleKnown: true }));
  }

  if (event.type === 'roomstate') {
    addChannel(event.channel);
    state.sevenTv.roomIdsByChannel.set(normalizeChannel(event.channel), event.roomId);
    loadSevenTvEmotes(event.channel, event.roomId);
    loadTwitchChatters(event.channel, event.roomId);
  }

  if (event.type === 'userstate') {
    addChannel(event.channel);
    addRosterUser(event.channel, event.nick, event.role, { roleKnown: event.roleKnown });
  }

  if (event.type === 'notice') {
    appendStatus(event.channel && event.channel.startsWith('#') ? `[${event.channel}] ${event.text}` : event.text, 'info');
  }

  if (event.type === 'message') {
    addChannel(event.target);
    addRosterUser(event.target, event.nick, event.role, { roleKnown: event.roleKnown });
    rememberChatter(event.nick);
    markChannelUnread(event.target);
    appendMessage(event);
    runBotRules(event);
    notifyOnMention(event);
  }

  if (event.type === 'action') {
    addChannel(event.target);
    addRosterUser(event.target, event.nick, event.role, { roleKnown: event.roleKnown });
    rememberChatter(event.nick);
    markChannelUnread(event.target);
    const actionPrefix = `* ${event.nick} `;
    appendMessage({
      ...event,
      text: `${actionPrefix}${event.text}`,
      twitchEmotes: shiftTwitchEmotes(event.twitchEmotes, actionPrefix.length),
    });
    notifyOnMention(event);
  }

  if (event.type === 'raw-in' || event.type === 'raw-out') {
    appendRaw(event);
  }

  if (event.type === 'unknown-command') {
    const alias = findAlias(event.command);
    if (alias) runAlias(alias, event.args, event.target, 1);
    else appendStatus(`Unknown command: /${event.command}`, 'error');
  }
}

function runInput(input) {
  runInputForTarget(input, state.activeChannel);
}

async function runInputForTarget(input, target = state.activeChannel, depth = 0) {
  if (depth > 8) {
    appendStatus('Command script stopped: nested command limit reached.', 'error');
    return;
  }

  const trimmed = input.trim();
  if (!trimmed) return;

  if (target === 'server') {
    appendStatus('Switch to a channel tab to send messages — the Server tab is read-only.', 'error');
    return;
  }

  if (trimmed.startsWith('/')) {
    const [commandName, ...args] = trimmed.slice(1).split(' ');
    const alias = findAlias(commandName);
    if (alias) {
      await runAlias(alias, args.join(' '), target, depth + 1);
      return;
    }
    if (commandName.toLowerCase() === 'part') {
      leaveChannel(args.join(' ') || target);
      return;
    }
  }

  window.macIRC.send({ target, text: trimmed });
}

function findAlias(commandName) {
  return state.settings.aliases.find((item) => item.name === normalizeCommandName(commandName));
}

function expandAliasOutput(alias, argText, channel) {
  const args = argText ? argText.split(' ') : [];
  return alias.output
    .replaceAll('$channel', channel || '')
    .replaceAll('$nick', state.settings.profile.nick || '')
    .replaceAll('$*', argText || '')
    .replace(/\$(\d+)/g, (_match, index) => args[Number(index) - 1] || '');
}

async function runAlias(alias, argText, target, depth) {
  if (alias.type === 'python') {
    await runPythonAlias(alias, argText, target, depth);
    return;
  }
  runScript(expandAliasOutput(alias, argText, target), target, depth);
}

async function runPythonAlias(alias, argText, target, depth) {
  const args = argText ? argText.split(' ') : [];
  const result = await window.macIRC.runPythonCommand({
    script: alias.output,
    args,
    argText,
    channel: target,
    nick: state.settings.profile.nick || '',
  });
  if (!result.ok) {
    appendStatus(`Python command /${alias.name} failed: ${result.error}`, 'error');
    return;
  }
  runScript(result.output || '', target, depth);
}

async function runBotRules(event) {
  if (event.direction !== 'in') return;
  const rules = state.settings.botRules || [];
  for (const rule of rules) {
    if (!rule.enabled) continue;
    const match = botRuleMatch(rule, event);
    if (!match) continue;
    await runBotRule(rule, event, match);
  }
}

function botRuleMatch(rule, event) {
  if (!botRuleMatchesChannel(rule, event.target)) return null;
  const text = String(event.text || '');
  const trigger = String(rule.triggerValue || '');
  if (rule.triggerType === 'any') return { args: [], argText: '', trigger };
  if (!trigger) return null;

  if (rule.triggerType === 'command') {
    const [command, ...args] = text.trim().split(/\s+/);
    if (command.toLowerCase() !== trigger.toLowerCase()) return null;
    return { args, argText: args.join(' '), trigger };
  }

  if (rule.triggerType === 'contains') {
    if (!text.toLowerCase().includes(trigger.toLowerCase())) return null;
    return { args: [], argText: text, trigger };
  }

  if (rule.triggerType === 'exact') {
    if (text.trim().toLowerCase() !== trigger.toLowerCase()) return null;
    return { args: [], argText: text, trigger };
  }

  return null;
}

function botRuleMatchesChannel(rule, target) {
  const scope = rule.channelScope || 'all';
  if (scope === 'all') return true;
  const ruleChannels = normalizeBotRuleChannels(rule);
  const eventChannel = normalizeChannel(target);
  return Boolean(eventChannel && ruleChannels.includes(eventChannel));
}

async function runBotRule(rule, event, match) {
  if (rule.responseType === 'python') {
    const result = await window.macIRC.runPythonCommand({
      script: rule.response,
      args: match.args,
      argText: match.argText,
      channel: event.target,
      nick: state.settings.profile.nick || '',
      user: event.nick || '',
      message: event.text || '',
      trigger: match.trigger,
    });
    if (!result.ok) {
      appendStatus(`Bot rule "${rule.name}" failed: ${result.error}`, 'error');
      return;
    }
    runScript(result.output || '', event.target, 1);
    return;
  }

  const response = renderBotTemplate(rule.response, event, match);
  runScript(response, event.target, 1);
}

function renderBotTemplate(template, event, match) {
  return String(template || '')
    .replaceAll('{user}', event.nick || '')
    .replaceAll('{channel}', normalizeChannel(event.target) || '')
    .replaceAll('{message}', event.text || '')
    .replaceAll('{args}', match.argText || '');
}

function runScript(script, target, depth) {
  script
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => runInputForTarget(line, target, depth));
}

function renderAll() {
  syncChannelOrder();
  applySavedChannelOrder();
  renderChannels();
  renderPopups();
  renderAutoJoinChannels();
  renderChatActions();
  renderRoster();
  renderAliases();
  renderBotRules();
  renderPopupEditor();
  renderTimers();
  renderStreamPlayer();
  scheduleAllTimers();

  if (state.settings.connection.connectOnOpen && !state.autoConnectStarted) {
    state.autoConnectStarted = true;
    connect();
  }
}

function renderChannels() {
  syncChannelOrder();
  applySavedChannelOrder();
  renderConnectionCard();
  el.channels.innerHTML = '';

  const tabs = ['server', ...displayChannels()];
  tabs.forEach((channel) => {
    const button = document.createElement('button');
    const isLive = channel !== 'server' && state.liveChannels.has(channel.replace(/^#/, '').toLowerCase());
    button.className = [
      'channel-tab',
      channel === 'server' ? 'channel-tab-server' : '',
      channel === state.activeChannel ? 'is-active' : '',
      state.unreadChannels.has(channel) ? 'has-unread' : '',
      isLive ? 'is-live' : '',
    ].filter(Boolean).join(' ');
    button.textContent = channel === 'server' ? 'Server' : channel;
    button.draggable = channel !== 'server';
    button.addEventListener('dragstart', (event) => {
      if (channel === 'server') return;
      state.draggedChannel = channel;
      button.classList.add('is-dragging');
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', channel);
    });
    button.addEventListener('dragend', () => {
      state.draggedChannel = '';
      button.classList.remove('is-dragging');
    });
    button.addEventListener('dragover', (event) => {
      if (channel === 'server' || !state.draggedChannel || state.draggedChannel === channel) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    });
    button.addEventListener('drop', async (event) => {
      event.preventDefault();
      const rect = button.getBoundingClientRect();
      const placeAfter = event.clientX > rect.left + (rect.width / 2);
      await reorderChannelTabs(state.draggedChannel, channel, placeAfter);
    });
    button.addEventListener('contextmenu', (event) => {
      if (channel === 'server') return;
      showChannelContextMenu(event, channel);
    });
    button.addEventListener('click', () => {
      state.activeChannel = channel;
      state.unreadChannels.delete(channel);
      renderChannels();
      renderTopic();
      renderRoster();
      renderMessages();
      renderChatActions();
      renderStreamPlayer();
    });
    el.channels.append(button);
  });

  if (state.channels.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'channel-tab-empty';
    empty.textContent = 'No joined channels yet';
    el.channels.append(empty);
  }

  renderTopic();
  renderTimerChannelOptions();
  renderChannelChrome();
  renderChatActions();
}

function applySavedChannelOrder() {
  const order = state.settings.connection.channelOrder || [];
  if (order.length === 0 || state.channels.length < 2) return;
  const rank = new Map(order.map((channel, index) => [normalizeChannel(channel), index]));
  state.channels.sort((a, b) => {
    const aRank = rank.has(a) ? rank.get(a) : Number.MAX_SAFE_INTEGER;
    const bRank = rank.has(b) ? rank.get(b) : Number.MAX_SAFE_INTEGER;
    if (aRank !== bRank) return aRank - bRank;
    return a.localeCompare(b);
  });
}

function syncChannelOrder() {
  state.settings.connection.channelOrder ||= [];
  const order = state.settings.connection.channelOrder.map(normalizeChannel).filter(Boolean);
  let changed = order.length !== state.settings.connection.channelOrder.length;
  state.channels.forEach((channel) => {
    if (!order.includes(channel)) {
      order.push(channel);
      changed = true;
    }
  });
  state.settings.connection.channelOrder = order.filter((channel) => state.channels.includes(channel));
  if (changed || state.settings.connection.channelOrder.length !== order.length) saveSettings();
}

function displayChannels() {
  const channels = state.channels.slice();
  if (!state.settings.preferences.moveLiveTabsToFront) return channels;
  return channels.sort((a, b) => {
    const aLive = state.liveChannels.has(a.replace(/^#/, '').toLowerCase());
    const bLive = state.liveChannels.has(b.replace(/^#/, '').toLowerCase());
    if (aLive !== bLive) return aLive ? -1 : 1;
    return 0;
  });
}

async function reorderChannelTabs(dragged, target, placeAfter = false) {
  const source = normalizeChannel(dragged);
  const destination = normalizeChannel(target);
  if (!source || !destination || source === destination) return;
  const current = state.channels.filter((channel) => channel !== source);
  const targetIndex = current.indexOf(destination);
  if (targetIndex < 0) return;
  current.splice(targetIndex + (placeAfter ? 1 : 0), 0, source);
  state.channels = current;
  state.settings.connection.channelOrder = current.slice();
  await saveSettings();
  renderChannels();
}

function showChannelContextMenu(event, channel) {
  event.preventDefault();
  hideContextMenu();
  const normalized = normalizeChannel(channel);
  const menu = document.createElement('div');
  menu.className = 'context-menu';

  const leaveOption = document.createElement('button');
  leaveOption.type = 'button';
  leaveOption.textContent = `Leave ${normalized}`;
  leaveOption.addEventListener('click', () => {
    hideContextMenu();
    leaveChannel(normalized);
  });

  menu.append(leaveOption);
  document.body.append(menu);
  positionContextMenu(menu, event.clientX, event.clientY);
  state.activeContextMenu = menu;
}

function renderTopic() {
  el.topicBar.innerHTML = '';
  const label = document.createElement('span');
  label.className = 'topic-label';

  if (state.activeChannel === 'server') {
    label.textContent = 'Server status — connection events, joins/parts, and notices live here.';
    el.topicBar.append(label);
    renderTimerPills();
    renderChannelStatusStrip();
    return;
  }

  label.textContent = state.activeChannel ? `Active channel: ${state.activeChannel}` : 'No active channel';
  el.topicBar.append(label);

  const channelTimers = timersForChannel(state.activeChannel);
  renderTimerPills();
  renderChannelStatusStrip();
  if (channelTimers.length === 0) return;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = `topic-timer-button${channelTimers.some((timer) => timer.enabled) ? ' active' : ' inactive'}`;
  button.textContent = channelTimers.some((timer) => timer.enabled) ? 'Timers Active' : 'Timers Inactive';
  button.addEventListener('click', openActiveChannelTimers);
  el.topicBar.append(button);
}

function renderChannelStatusStrip() {
  if (!el.channelStatusStrip) return;
  el.channelStatusStrip.innerHTML = '';
  if (!state.activeChannel || state.activeChannel === 'server') return;

  const channel = state.activeChannel;
  const userCount = (state.rosters.get(channel) || new Map()).size;
  const messageCount = (state.messagesByTarget.get(channel) || []).filter((entry) => entry.kind === 'message').length;
  const botOn = (state.settings.botRules || []).some((rule) => rule.enabled && botRuleMatchesChannel(rule, channel));
  const logsOn = Boolean(state.settings.preferences.channelLogging && state.settings.preferences.channelLogFolder);

  let liveLabel = 'Unknown';
  let liveClass = '';
  if (state.connected && state.twitchClientId && shouldPollLiveChannels()) {
    const login = channel.replace(/^#/, '').toLowerCase();
    liveLabel = state.liveChannels.has(login) ? 'Yes' : 'No';
    liveClass = state.liveChannels.has(login) ? 'is-good' : '';
  }

  const name = document.createElement('span');
  name.className = 'channel-status-name';
  name.textContent = channel;
  el.channelStatusStrip.append(name);

  el.channelStatusStrip.append(
    statusPill('Live', liveLabel, liveClass),
    statusPill('Users', String(userCount)),
    statusPill('Messages', String(messageCount)),
    statusPill('Connection', state.connected ? 'Online' : 'Offline', state.connected ? 'is-good' : 'is-bad'),
    statusPill('Bot', botOn ? 'On' : 'Off', botOn ? 'is-good' : ''),
    statusPill('Logs', logsOn ? 'On' : 'Off', logsOn ? 'is-good' : '')
  );
}

function statusPill(label, value, extraClass = '') {
  const pill = document.createElement('span');
  pill.className = `status-pill${extraClass ? ` ${extraClass}` : ''}`;
  pill.textContent = `${label}: ${value}`;
  return pill;
}

function renderChannelChrome() {
  const isServer = isServerTarget(state.activeChannel);
  el.chatTab.classList.toggle('is-server-channel', isServer);
  el.rosterPanel.hidden = isServer;
  el.inputForm.hidden = isServer;
  el.popupBar.hidden = isServer;
  if (isServer) {
    el.chatActionBar.hidden = true;
    hideNickSuggestion();
  }
}

function timersForChannel(channel) {
  const normalized = normalizeChannel(channel);
  if (!normalized || normalized === 'server') return [];
  return state.settings.timedMessages.filter((timer) => normalizeChannel(timer.channel) === normalized);
}

function openActiveChannelTimers() {
  const channel = normalizeChannel(state.activeChannel);
  activateTab('timers');
  renderTimerChannelOptions();
  if (channel && state.channels.includes(channel)) el.timerChannel.value = channel;
}

function renderStreamPlayer() {
  const configuredChannel = state.settings.appearance.twitchPlayerChannel || streamChannelFromActiveChannel();
  const enabled = state.settings.appearance.twitchPlayer && Boolean(configuredChannel);
  const width = enabled
    ? Math.min(720, Math.max(336, Number(state.settings.appearance.twitchPlayerWidth || 420)))
    : 336;
  document.documentElement.style.setProperty('--sidebar-width', `${width}px`);
  el.streamSidebarButton.textContent = enabled ? 'Hide Stream' : 'Watch Active Stream';
  el.streamPanel.hidden = !enabled;
  if (!enabled) {
    clearStreamPlayer();
    return;
  }

  const channel = configuredChannel;
  el.streamTitle.textContent = `${channel} live`;
  updateStreamNavigation(channel);
  updateStreamControlButtons();
  if (state.streamPlayerChannel === channel && state.streamPlayer) return;

  saveCurrentStreamPlayerState();
  state.settings.appearance.twitchPlayerChannel = channel;
  createStreamPlayer(channel);
}

function streamChannelFromActiveChannel() {
  if (!state.activeChannel || state.activeChannel === 'server') return '';
  return state.activeChannel.replace(/^#/, '');
}

function streamChannels() {
  const active = streamChannelFromActiveChannel();
  const joined = uniqueChannels([
    ...state.channels,
    ...state.settings.connection.autoJoinChannels,
    active ? `#${active}` : '',
  ])
    .map((channel) => channel.replace(/^#/, '').toLowerCase())
    .filter(Boolean);
  const live = joined.filter((channel) => state.liveChannels.has(channel));
  return live.length > 0 ? live : joined;
}

async function navigateStream(direction) {
  const channels = streamChannels();
  if (channels.length < 2) return;
  const current = (state.settings.appearance.twitchPlayerChannel || streamChannelFromActiveChannel()).toLowerCase();
  const currentIndex = Math.max(0, channels.indexOf(current));
  const nextIndex = (currentIndex + direction + channels.length) % channels.length;
  saveCurrentStreamPlayerState();
  state.settings.appearance.twitchPlayer = true;
  state.settings.appearance.twitchPlayerChannel = channels[nextIndex];
  await saveSettings();
  renderStreamPlayer();
}

function updateStreamNavigation(channel) {
  const channels = streamChannels();
  const canNavigate = channels.length > 1;
  el.streamPreviousButton.disabled = !canNavigate;
  el.streamNextButton.disabled = !canNavigate;
  const index = channels.indexOf(channel.toLowerCase());
  const position = index >= 0 ? `${index + 1}/${channels.length}` : `1/${Math.max(1, channels.length)}`;
  el.streamPreviousButton.title = `Previous stream (${position})`;
  el.streamNextButton.title = `Next stream (${position})`;
}

function createStreamPlayer(channel) {
  clearStreamPlayer();
  const playerState = streamPlayerState(channel);
  if (!window.Twitch?.Player) {
    const iframe = document.createElement('iframe');
    iframe.title = 'Twitch stream';
    iframe.allowFullscreen = true;
    iframe.src = twitchPlayerUrl(channel, playerState);
    el.streamPlayer.append(iframe);
    state.streamPlayerChannel = channel;
    updateStreamControlButtons();
    return;
  }

  state.streamPlayer = new window.Twitch.Player('streamPlayer', {
    channel,
    parent: ['localhost'],
    width: '100%',
    height: '100%',
    muted: Boolean(playerState.muted),
    autoplay: !playerState.paused,
  });
  state.streamPlayerChannel = channel;
  state.streamPlayer.addEventListener(window.Twitch.Player.READY, () => {
    if (typeof playerState.volume === 'number') state.streamPlayer.setVolume(playerState.volume);
    state.streamPlayer.setMuted(Boolean(playerState.muted));
    if (playerState.paused) state.streamPlayer.pause();
    updateStreamControlButtons();
  });
}

function clearStreamPlayer() {
  state.streamPlayer = null;
  state.streamPlayerChannel = '';
  el.streamPlayer.innerHTML = '';
}

function twitchPlayerUrl(channel, playerState = {}) {
  const params = new URLSearchParams({
    channel,
    parent: 'localhost',
    muted: String(Boolean(playerState.muted)),
    autoplay: String(!playerState.paused),
  });
  return `https://player.twitch.tv/?${params.toString()}`;
}

function saveCurrentStreamPlayerState() {
  const channel = state.streamPlayerChannel;
  if (!channel || !state.streamPlayer) return;
  const current = streamPlayerState(channel);
  try {
    state.settings.appearance.twitchPlayerStates[channel] = {
      muted: typeof state.streamPlayer.getMuted === 'function' ? state.streamPlayer.getMuted() : current.muted,
      paused: typeof state.streamPlayer.isPaused === 'function' ? state.streamPlayer.isPaused() : current.paused,
      volume: typeof state.streamPlayer.getVolume === 'function' ? state.streamPlayer.getVolume() : current.volume,
    };
    saveSettings();
  } catch {
    // Player state is best-effort; Twitch may not be ready yet.
  }
}

function toggleStreamPlayback() {
  if (!state.streamPlayer) return;
  try {
    if (state.streamPlayer.isPaused()) state.streamPlayer.play();
    else state.streamPlayer.pause();
    setTimeout(() => {
      saveCurrentStreamPlayerState();
      updateStreamControlButtons();
    }, 100);
  } catch {
    updateStreamControlButtons();
  }
}

function toggleStreamMute() {
  if (!state.streamPlayer) return;
  try {
    state.streamPlayer.setMuted(!state.streamPlayer.getMuted());
    setTimeout(() => {
      saveCurrentStreamPlayerState();
      updateStreamControlButtons();
    }, 100);
  } catch {
    updateStreamControlButtons();
  }
}

function updateStreamControlButtons() {
  const hasApiPlayer = Boolean(state.streamPlayer);
  el.streamPlayButton.disabled = !hasApiPlayer;
  el.streamMuteButton.disabled = !hasApiPlayer;
  if (!hasApiPlayer) {
    el.streamPlayButton.textContent = 'Pause';
    el.streamMuteButton.textContent = 'Mute';
    return;
  }
  try {
    el.streamPlayButton.textContent = state.streamPlayer.isPaused() ? 'Play' : 'Pause';
    el.streamMuteButton.textContent = state.streamPlayer.getMuted() ? 'Unmute' : 'Mute';
  } catch {
    el.streamPlayButton.textContent = 'Pause';
    el.streamMuteButton.textContent = 'Mute';
  }
}

function streamPlayerState(channel) {
  return state.settings.appearance.twitchPlayerStates?.[channel] || {
    muted: false,
    paused: false,
    volume: 0.5,
  };
}

function startStreamResize(event) {
  if (!state.settings.appearance.twitchPlayer) return;
  event.preventDefault();
  const startX = event.clientX;
  const startWidth = Number(state.settings.appearance.twitchPlayerWidth || 420);

  const onMove = (moveEvent) => {
    const nextWidth = Math.min(720, Math.max(336, startWidth + (moveEvent.clientX - startX)));
    document.documentElement.style.setProperty('--sidebar-width', `${nextWidth}px`);
    state.settings.appearance.twitchPlayerWidth = Math.round(nextWidth);
  };

  const onUp = async () => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    await saveSettings();
  };

  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
}

function renderRoster() {
  el.roster.innerHTML = '';
  renderChannelStatusStrip();
  if (isServerTarget(state.activeChannel)) {
    el.rosterCount.textContent = '0';
    return;
  }
  const users = Array.from((state.rosters.get(state.activeChannel) || new Map()).values())
    .sort((first, second) => first.nick.localeCompare(second.nick, undefined, { sensitivity: 'base' }));

  el.rosterCount.textContent = String(users.length);

  if (users.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'roster-empty';
    empty.textContent = 'No users yet';
    el.roster.append(empty);
    return;
  }

  users.forEach((user) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `roster-user${user.role ? ` ${user.role}` : ''}${isMonitored(user.nick) ? ' monitored' : ''}${isHidden(user.nick) ? ' hidden-chat' : ''}`;
    appendRoleIcon(item, user.role);
    item.append(document.createTextNode(user.nick));
    item.addEventListener('click', () => {
      el.messageInput.value = `${el.messageInput.value}${user.nick}: `;
      el.messageInput.focus();
    });
    item.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      showRosterContextMenu(event, user.nick);
    });
    el.roster.append(item);
  });
}

function isMonitored(nick) {
  return state.monitored.has(nick.toLowerCase());
}

function isHidden(nick, channel = state.activeChannel) {
  return Boolean(state.hiddenNicks.get(channel)?.has(nick.toLowerCase()));
}

async function toggleHidden(nick, channel = state.activeChannel) {
  if (!channel) return;
  const key = nick.toLowerCase();
  if (!state.hiddenNicks.has(channel)) state.hiddenNicks.set(channel, new Set());
  const hidden = state.hiddenNicks.get(channel);
  if (hidden.has(key)) {
    hidden.delete(key);
    appendStatus(`Showing ${nick}'s chats again in ${channel}.`, 'info');
  } else {
    hidden.add(key);
    appendStatus(`Hiding ${nick}'s chats in ${channel}.`, 'info');
  }
  renderMessages();
  renderRoster();
  await persistHiddenChats();
}

function showRosterContextMenu(event, nick) {
  hideContextMenu();
  const menu = document.createElement('div');
  menu.className = 'context-menu';

  const monitorOption = document.createElement('button');
  monitorOption.type = 'button';
  monitorOption.textContent = isMonitored(nick) ? 'Unmonitor' : 'Monitor';
  monitorOption.addEventListener('click', () => {
    hideContextMenu();
    toggleMonitor(nick);
  });

  const hideOption = document.createElement('button');
  hideOption.type = 'button';
  hideOption.textContent = isHidden(nick) ? 'Unhide Chats' : 'Hide Chats';
  hideOption.addEventListener('click', () => {
    hideContextMenu();
    toggleHidden(nick);
  });

  menu.append(monitorOption, hideOption);
  document.body.append(menu);
  positionContextMenu(menu, event.clientX, event.clientY);
  state.activeContextMenu = menu;
}

function positionContextMenu(menu, clientX, clientY) {
  const { innerWidth, innerHeight } = window;
  const x = Math.min(clientX, innerWidth - menu.offsetWidth - 8);
  const y = Math.min(clientY, innerHeight - menu.offsetHeight - 8);
  menu.style.left = `${Math.max(8, x)}px`;
  menu.style.top = `${Math.max(8, y)}px`;
}

function hideContextMenu() {
  if (state.activeContextMenu) {
    state.activeContextMenu.remove();
    state.activeContextMenu = null;
  }
}

async function toggleMonitor(nick) {
  const key = nick.toLowerCase();
  if (state.monitored.has(key)) {
    state.monitored.delete(key);
    appendStatus(`Stopped monitoring ${nick}.`, 'info');
    renderRoster();
    renderMessages();
    return;
  }

  state.monitored.set(key, { nick, logPath: '' });
  appendStatus(`Now monitoring ${nick}. Their messages will be highlighted.`, 'info');
  renderRoster();
  renderMessages();

  const wantsLog = window.confirm(`Save a log file of ${nick}'s messages?`);
  if (!wantsLog) return;

  const suggestedName = `${nick}-ClovaChat-log.txt`;
  const result = await window.macIRC.chooseLogFile(suggestedName);
  if (!result.ok) return;

  state.monitored.get(key).logPath = result.path;

  const existingLines = collectMonitoredHistory(nick);
  if (existingLines) await window.macIRC.appendLog(result.path, existingLines);
  appendStatus(`Logging ${nick}'s messages to ${result.path}`, 'info');
}

function collectMonitoredHistory(nick) {
  const lines = [];
  for (const messages of state.messagesByTarget.values()) {
    messages.forEach((entry) => {
      if (entry.kind === 'message' && entry.nick?.toLowerCase() === nick.toLowerCase()) {
        lines.push(formatLogLine(entry));
      }
    });
  }
  return lines.join('');
}

function formatLogLine(entry) {
  const time = new Date(entry.timestamp).toISOString();
  return `[${time}] ${entry.nick}: ${entry.text}\n`;
}

function renderAutoJoinChannels() {
  el.autoJoinList.innerHTML = '';
  if (state.settings.connection.autoJoinChannels.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'auto-join-empty';
    empty.textContent = 'No auto-join channels';
    el.autoJoinList.append(empty);
    return;
  }

  state.settings.connection.autoJoinChannels.forEach((channel) => {
    const item = document.createElement('div');
    item.className = 'auto-join-item';
    const name = document.createElement('span');
    name.textContent = channel;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'icon-button';
    remove.textContent = '✕';
    remove.title = `Remove ${channel}`;
    remove.addEventListener('click', async () => {
      state.settings.connection.autoJoinChannels = state.settings.connection.autoJoinChannels
        .filter((entry) => entry !== channel);
      await saveSettings();
      renderAutoJoinChannels();
      renderChatActions();
    });
    item.append(name, remove);
    el.autoJoinList.append(item);
  });
}

function updateNickSuggestion() {
  const match = nickCompletionMatch();
  if (!match) {
    hideNickSuggestion();
    return;
  }

  const prefix = match.query.toLowerCase();
  const suggestion = nickCompletionCandidates()
    .find((nick) => nick.toLowerCase().startsWith(prefix) && nick.toLowerCase() !== prefix);

  if (!suggestion) {
    hideNickSuggestion();
    return;
  }

  state.nickSuggestion = suggestion;
  el.nickSuggest.hidden = false;
  el.nickSuggest.textContent = `Tab: @${suggestion}`;
}

function applyNickSuggestion() {
  const match = nickCompletionMatch();
  if (!match || !state.nickSuggestion) return;

  const value = el.messageInput.value;
  el.messageInput.value = `${value.slice(0, match.start)}@${state.nickSuggestion}${value.slice(match.end)}`;
  const caret = match.start + state.nickSuggestion.length + 1;
  el.messageInput.setSelectionRange(caret, caret);
  hideNickSuggestion();
}

function hideNickSuggestion() {
  state.nickSuggestion = '';
  el.nickSuggest.hidden = true;
  el.nickSuggest.textContent = '';
}

function nickCompletionMatch() {
  const value = el.messageInput.value;
  const caret = el.messageInput.selectionStart ?? value.length;
  const beforeCaret = value.slice(0, caret);
  const match = beforeCaret.match(/(^|\s)@([A-Za-z0-9_]{1,25})$/);
  if (!match) return null;

  const start = beforeCaret.length - match[2].length - 1;
  return {
    start,
    end: caret,
    query: match[2],
  };
}

function nickCompletionCandidates() {
  const activeRoster = Array.from((state.rosters.get(state.activeChannel) || new Map()).values())
    .map((user) => user.nick);
  return uniqueNicks([...state.recentChatters, ...activeRoster]);
}

function renderPopups() {
  el.popupBar.innerHTML = '';
  if (isServerTarget(state.activeChannel)) {
    el.popupBar.hidden = true;
    renderPopupEditor();
    return;
  }
  el.popupBar.hidden = false;
  state.settings.popups.forEach((popup) => {
    const button = document.createElement('button');
    button.textContent = popup.label;
    button.addEventListener('click', () => {
      const command = popup.command.replaceAll('$channel', state.activeChannel || '');
      runInput(command);
    });
    el.popupBar.append(button);
  });
  renderPopupEditor();
}

function renderChatActions() {
  const channel = isServerTarget(state.activeChannel) ? '' : normalizeChannel(state.activeChannel);
  const canAutoJoin = Boolean(channel && !channelIsAutoJoined(channel));
  el.chatActionBar.hidden = !canAutoJoin;
  el.addAutoJoinCurrentButton.hidden = !canAutoJoin;
  if (canAutoJoin) el.addAutoJoinCurrentButton.textContent = `Add ${channel} to Auto Join`;
}

function channelIsAutoJoined(channel) {
  const normalized = normalizeChannel(channel);
  return state.settings.connection.autoJoinChannels.some((entry) => normalizeChannel(entry) === normalized);
}

function renderAliases() {
  el.aliasList.innerHTML = '';
  state.settings.aliases.forEach((alias) => {
    const item = document.createElement('div');
    item.className = 'editor-item alias-item';
    item.innerHTML = `<strong>/${escapeHtml(alias.name)}</strong><span>${escapeHtml(alias.type === 'python' ? 'Python' : 'mIRC')}</span><code>${escapeHtml(alias.output)}</code>`;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Remove';
    remove.addEventListener('click', async () => {
      state.settings.aliases = state.settings.aliases.filter((entry) => entry.name !== alias.name);
      await saveSettings();
      renderAliases();
    });
    item.append(remove);
    el.aliasList.append(item);
  });
}

function renderBotRules() {
  el.botRuleList.innerHTML = '';
  updateBotTriggerInput();
  updateBotResponsePlaceholder();
  updateBotChannelScope();

  if (state.settings.botRules.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No bot rules yet';
    el.botRuleList.append(empty);
    return;
  }

  state.settings.botRules.forEach((rule) => {
    const item = document.createElement('div');
    item.className = 'editor-item bot-rule-item';

    const stateLabel = document.createElement('label');
    stateLabel.className = 'rule-state';
    const enabled = document.createElement('input');
    enabled.type = 'checkbox';
    enabled.checked = rule.enabled;
    enabled.addEventListener('change', async () => {
      rule.enabled = enabled.checked;
      await saveSettings();
      renderBotRules();
    });
    stateLabel.append(enabled, document.createTextNode(rule.enabled ? 'On' : 'Off'));

    const name = document.createElement('strong');
    name.textContent = rule.name || botRuleFallbackName(rule.triggerType, rule.triggerValue);

    const summary = document.createElement('div');
    summary.className = 'rule-summary';
    const trigger = document.createElement('span');
    trigger.textContent = botRuleSummary(rule);
    const response = document.createElement('code');
    response.textContent = rule.response;
    summary.append(trigger, response);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Remove';
    remove.addEventListener('click', async () => {
      state.settings.botRules = state.settings.botRules.filter((entry) => entry.id !== rule.id);
      await saveSettings();
      renderBotRules();
    });

    item.append(stateLabel, name, summary, remove);
    el.botRuleList.append(item);
  });
}

function updateBotTriggerInput() {
  const isAny = el.botTriggerType.value === 'any';
  el.botTriggerValue.disabled = isAny;
  if (isAny) el.botTriggerValue.value = '';
  el.botTriggerValue.placeholder = {
    command: '!hello',
    contains: 'keyword',
    exact: 'exact message',
    any: 'not needed',
  }[el.botTriggerType.value] || '';
}

function updateBotResponsePlaceholder() {
  el.botResponse.placeholder = el.botResponseType.value === 'python'
    ? 'if user.lower() != nick.lower():\n    send(f"Hi {user}!")'
    : 'Hi {user}!';
}

function updateBotChannelScope() {
  const showSpecific = el.botChannelScope.value === 'specific';
  el.botSpecificChannelLabel.hidden = !showSpecific;
  if (el.botChannelScope.value === 'current') {
    const channel = normalizeChannel(state.activeChannel);
    el.botSpecificChannel.placeholder = channel && channel !== 'server' ? channel : '#channel';
  }
}

function botRuleChannelScope() {
  if (el.botChannelScope.value === 'all') return { type: 'all', channel: '', channels: [] };
  if (el.botChannelScope.value === 'current') {
    const channel = normalizeChannel(state.activeChannel);
    const channels = channel === 'server' ? [] : [channel];
    return { type: 'specific', channel: channels[0] || '', channels };
  }
  const channels = parseChannelList(el.botSpecificChannel.value);
  return { type: 'specific', channel: channels[0] || '', channels };
}

function applyBotWizardIntent() {
  const intent = el.botIntentInput.value.trim();
  if (!intent) return;
  const draft = draftBotRuleFromIntent(intent);
  el.botRuleName.value = draft.name;
  el.botChannelScope.value = draft.channelScope;
  el.botSpecificChannel.value = draft.channel || '';
  el.botTriggerType.value = draft.triggerType;
  el.botTriggerValue.value = draft.triggerValue;
  el.botResponseType.value = draft.responseType;
  el.botResponse.value = draft.response;
  updateBotTriggerInput();
  updateBotResponsePlaceholder();
  updateBotChannelScope();
  el.botWizardPreview.textContent = `${draft.name}: ${botTriggerLabel(draft.triggerType)} ${draft.triggerValue || 'any message'} -> ${draft.responseType === 'python' ? 'Python' : 'reply'}`;
}

function draftBotRuleFromIntent(intent) {
  const text = intent.toLowerCase();
  const command = intent.match(/!\w[\w-]*/)?.[0];
  const quoted = intent.match(/["'“”](.+?)["'“”]/)?.[1];
  const channel = intent.match(/#([a-z0-9_]{1,25})/i)?.[0] || '';
  const wantsAllChannels = /\b(all|every)\s+channels?\b/.test(text);
  const wantsThisChannel = /\b(this|current)\s+channel\b/.test(text);
  const response = botWizardResponse(intent, command);

  if (/\bpython\b/.test(text)) {
    return {
      name: command ? `${command} Python reply` : 'Python bot rule',
      channelScope: wantsAllChannels ? 'all' : (channel ? 'specific' : 'current'),
      channel,
      triggerType: command ? 'command' : 'contains',
      triggerValue: command || quoted || 'keyword',
      responseType: 'python',
      response: 'send(f"Hi {user}!")',
    };
  }

  if (/\b(thank|thanks|ty)\b/.test(text) && !command) {
    return {
      name: 'Thank viewers',
      channelScope: wantsAllChannels ? 'all' : (channel ? 'specific' : 'current'),
      channel,
      triggerType: 'contains',
      triggerValue: 'thank',
      responseType: 'reply',
      response: 'You are welcome, {user}!',
    };
  }

  return {
    name: botWizardName(text, command),
    channelScope: wantsAllChannels ? 'all' : (channel ? 'specific' : (wantsThisChannel ? 'current' : 'current')),
    channel,
    triggerType: command ? 'command' : (quoted ? 'exact' : 'contains'),
    triggerValue: command || quoted || 'hello',
    responseType: 'reply',
    response,
  };
}

function botWizardName(text, command) {
  if (/\bdiscord\b/.test(text)) return 'Share Discord';
  if (/\bsocials?\b/.test(text)) return 'Share Socials';
  if (/\bwelcome\b/.test(text)) return 'Welcome viewers';
  return command ? `${command} reply` : 'Chat response';
}

function botWizardResponse(intent, command) {
  const text = intent.toLowerCase();
  const replyMatch = intent.match(/\b(?:say|reply|respond)(?:s| with| to)?\s+(.+)$/i);
  if (/\bdiscord\b/.test(text)) return 'Join the Discord: ';
  if (/\bsocials?\b/.test(text)) return 'Follow me here: ';
  if (/\bwelcome\b/.test(text)) return 'Welcome in, {user}!';
  if (replyMatch?.[1]) return replyMatch[1].replace(/^with\s+/i, '').trim();
  return command ? 'Hi {user}!' : 'Hi {user}!';
}

function botRuleFallbackName(triggerType, triggerValue) {
  if (triggerType === 'any') return 'Every chat message';
  return triggerValue ? `When ${triggerValue}` : 'Bot rule';
}

function botRuleSummary(rule) {
  const trigger = rule.triggerType === 'any'
    ? 'Any chat message'
    : `${botTriggerLabel(rule.triggerType)}: ${rule.triggerValue}`;
  const response = rule.responseType === 'python' ? 'Advanced Python' : 'Simple reply';
  return `${botRuleChannelLabel(rule)} · ${trigger} -> ${response}`;
}

function botRuleChannelLabel(rule) {
  if ((rule.channelScope || 'all') === 'all') return 'All channels';
  const channels = normalizeBotRuleChannels(rule);
  return channels.length > 0 ? `Only ${channels.join(', ')}` : 'One channel';
}

function normalizeBotRuleChannels(rule) {
  const channels = Array.isArray(rule.channels) && rule.channels.length > 0
    ? rule.channels
    : [rule.channel];
  return uniqueChannels(channels.map(normalizeChannel).filter(Boolean));
}

function parseChannelList(value) {
  return uniqueChannels(String(value || '')
    .split(/[\s,]+/)
    .map(normalizeChannel)
    .filter(Boolean));
}

function botTriggerLabel(type) {
  return {
    command: 'Command',
    contains: 'Contains',
    exact: 'Exact',
    any: 'Any',
  }[type] || 'Trigger';
}

function normalizeBotTriggerValue(triggerType, value) {
  const trimmed = value.trim();
  if (triggerType === 'command' && trimmed && !trimmed.startsWith('!')) return `!${trimmed}`;
  return trimmed;
}

function renderTimers() {
  renderTimerChannelOptions();
  el.timerList.innerHTML = '';
  if (state.settings.timedMessages.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No timed messages yet';
    el.timerList.append(empty);
    renderTopic();
    return;
  }

  state.settings.timedMessages.forEach((timer) => {
    timer.seconds ??= 0;
    timer.expiresAt ??= null;
    timer.showOnChannel ??= false;
    const item = document.createElement('div');
    item.className = 'timer-item';

    const toggle = document.createElement('label');
    toggle.className = 'timer-toggle';
    const enabled = document.createElement('input');
    enabled.type = 'checkbox';
    enabled.checked = timer.enabled;
    const toggleLabel = document.createElement('span');
    toggleLabel.textContent = timer.enabled ? 'Enabled' : 'Paused';
    enabled.addEventListener('change', async () => {
      timer.enabled = enabled.checked;
      if (timer.enabled) clearExpiredDeadline(timer);
      toggleLabel.textContent = timer.enabled ? 'Enabled' : 'Paused';
      await saveSettings();
      scheduleTimer(timer);
      renderTopic();
    });
    toggle.append(enabled, toggleLabel);

    const summary = document.createElement('div');
    summary.innerHTML = `<strong>${escapeHtml(timer.channel)}</strong><span>Every ${escapeHtml(formatTimerInterval(timer))}</span><code>${escapeHtml(timer.message)}</code>`;

    const expirationRow = document.createElement('div');
    expirationRow.className = 'timer-expiration-edit';

    const status = document.createElement('span');
    status.className = 'timer-expiration-status';
    status.textContent = timer.expiresAt
      ? (timer.expiresAt > Date.now() ? `Expires in ${formatDuration(timer.expiresAt - Date.now())}` : 'Expired')
      : 'No expiration';

    const daysInput = document.createElement('input');
    daysInput.type = 'number';
    daysInput.min = '0';
    daysInput.placeholder = 'Days';
    const hoursInput = document.createElement('input');
    hoursInput.type = 'number';
    hoursInput.min = '0';
    hoursInput.max = '23';
    hoursInput.placeholder = 'Hours';
    const minutesInput = document.createElement('input');
    minutesInput.type = 'number';
    minutesInput.min = '0';
    minutesInput.max = '59';
    minutesInput.placeholder = 'Minutes';

    const setButton = document.createElement('button');
    setButton.type = 'button';
    setButton.textContent = timer.expiresAt ? 'Update' : 'Set Expiration';
    setButton.addEventListener('click', async () => {
      const days = Math.max(0, Number(daysInput.value || 0));
      const hours = Math.max(0, Number(hoursInput.value || 0));
      const minutes = Math.max(0, Number(minutesInput.value || 0));
      const ms = ((days * 86400) + (hours * 3600) + (minutes * 60)) * 1000;
      if (ms <= 0) return;
      timer.expiresAt = Date.now() + ms;
      await saveSettings();
      renderTimers();
      scheduleTimer(timer);
    });

    const clearButton = document.createElement('button');
    clearButton.type = 'button';
    clearButton.textContent = 'Clear';
    clearButton.hidden = !timer.expiresAt;
    clearButton.addEventListener('click', async () => {
      timer.expiresAt = null;
      await saveSettings();
      renderTimers();
      scheduleTimer(timer);
    });

    expirationRow.append(status, daysInput, hoursInput, minutesInput, setButton, clearButton);

    const showToggle = document.createElement('label');
    showToggle.className = 'timer-toggle';
    const showOnChannel = document.createElement('input');
    showOnChannel.type = 'checkbox';
    showOnChannel.checked = timer.showOnChannel;
    const showToggleLabel = document.createElement('span');
    showToggleLabel.textContent = 'On channel';
    showOnChannel.addEventListener('change', async () => {
      timer.showOnChannel = showOnChannel.checked;
      await saveSettings();
      renderTopic();
    });
    showToggle.append(showOnChannel, showToggleLabel);

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Remove';
    remove.addEventListener('click', async () => {
      unscheduleTimer(timer.id);
      state.settings.timedMessages = state.settings.timedMessages.filter((entry) => entry.id !== timer.id);
      await saveSettings();
      renderTimers();
    });

    item.append(toggle, summary, showToggle, remove, expirationRow);
    el.timerList.append(item);
  });
  renderTopic();
}

function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

function renderTimerChannelOptions() {
  const selected = el.timerChannel.value || state.activeChannel;
  el.timerChannel.innerHTML = '';

  if (state.channels.length === 0) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Join a channel first';
    el.timerChannel.append(option);
    el.timerChannel.disabled = true;
    return;
  }

  el.timerChannel.disabled = false;
  state.channels.forEach((channel) => {
    const option = document.createElement('option');
    option.value = channel;
    option.textContent = channel;
    el.timerChannel.append(option);
  });

  el.timerChannel.value = state.channels.includes(selected) ? selected : state.channels[0];
}

// Schedules every timer from scratch. Only call this for events that should
// legitimately reset every timer's countdown (connecting, full app init) —
// individual create/toggle/delete actions must call scheduleTimer()/
// unscheduleTimer() for just the one timer they touched, or every other
// timer's countdown gets yanked back to its full interval too.
function scheduleAllTimers() {
  clearTimerHandles();
  let expiredChanged = false;
  state.settings.timedMessages.forEach((timer) => {
    if (timer.enabled && timer.expiresAt && Date.now() >= timer.expiresAt) {
      timer.enabled = false;
      expiredChanged = true;
    }
  });
  if (expiredChanged) {
    saveSettings();
    renderTimers();
  }

  state.settings.timedMessages.forEach((timer) => scheduleTimer(timer));
  ensureTimerPillTicking();
  renderTopic();
}

function scheduleTimer(timer) {
  unscheduleTimer(timer.id);
  if (!timer.enabled || !state.connected) return;

  timer.seconds ??= 0;
  const intervalSeconds = Math.max(1, (Number(timer.minutes || 0) * 60) + Number(timer.seconds || 0));
  const intervalMs = intervalSeconds * 1000;
  state.timerNextFire.set(timer.id, Date.now() + intervalMs);

  const handle = setInterval(() => {
    const current = state.settings.timedMessages.find((entry) => entry.id === timer.id);
    if (!current?.enabled) {
      unscheduleTimer(timer.id);
      return;
    }
    runInputForTarget(current.message, normalizeChannel(current.channel));
    state.timerNextFire.set(current.id, Date.now() + intervalMs);
  }, intervalMs);
  state.timerHandles.set(timer.id, handle);

  if (timer.expiresAt) {
    const expiryHandle = setTimeout(() => {
      const current = state.settings.timedMessages.find((entry) => entry.id === timer.id);
      if (!current?.enabled || !current.expiresAt || Date.now() < current.expiresAt) return;
      current.enabled = false;
      saveSettings();
      renderTimers();
      unscheduleTimer(timer.id);
      renderTopic();
    }, Math.max(0, timer.expiresAt - Date.now()));
    state.timerExpiryHandles.set(timer.id, expiryHandle);
  }

  ensureTimerPillTicking();
}

function unscheduleTimer(id) {
  const handle = state.timerHandles.get(id);
  if (handle) {
    clearInterval(handle);
    state.timerHandles.delete(id);
  }
  const expiryHandle = state.timerExpiryHandles.get(id);
  if (expiryHandle) {
    clearTimeout(expiryHandle);
    state.timerExpiryHandles.delete(id);
  }
}

function clearTimerHandles() {
  for (const handle of state.timerHandles.values()) clearInterval(handle);
  state.timerHandles.clear();
  for (const handle of state.timerExpiryHandles.values()) clearTimeout(handle);
  state.timerExpiryHandles.clear();
}

/** Manually flipping a timer back on after it auto-expired should let it run
 * again, not get force-disabled the instant it's rescheduled. */
function clearExpiredDeadline(timer) {
  if (timer.enabled && timer.expiresAt && Date.now() >= timer.expiresAt) {
    timer.expiresAt = null;
  }
}

function sendTimerNow(timer) {
  runInputForTarget(timer.message, normalizeChannel(timer.channel));
  scheduleTimer(timer);
}

function ensureTimerPillTicking() {
  if (state.timerPillTickHandle) return;
  state.timerPillTickHandle = setInterval(renderTimerPills, 1000);
}

function timerCountdownText(timer) {
  if (!timer.enabled) return 'paused';
  if (!state.connected) return 'disconnected';
  const nextFire = state.timerNextFire.get(timer.id);
  if (!nextFire) return '—';
  return `next in ${formatDuration(Math.max(0, nextFire - Date.now()))}`;
}

function renderTimerPills() {
  if (!el.timerPills) return;
  el.timerPills.innerHTML = '';

  const pills = timersForChannel(state.activeChannel).filter((timer) => timer.showOnChannel);
  pills.forEach((timer) => {
    const pill = document.createElement('div');
    pill.className = `timer-pill${timer.enabled ? '' : ' is-paused'}`;
    pill.title = 'Click to send this message now and restart the timer';
    pill.addEventListener('click', () => {
      sendTimerNow(timer);
      renderTimerPills();
    });

    const message = document.createElement('span');
    message.className = 'timer-pill-message';
    message.textContent = timer.message;
    message.title = timer.message;

    const countdown = document.createElement('span');
    countdown.className = 'timer-pill-countdown';
    countdown.textContent = timerCountdownText(timer);

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.title = timer.enabled ? 'Pause timer' : 'Resume timer';
    toggle.textContent = timer.enabled ? '⏸' : '▶';
    toggle.addEventListener('click', async (event) => {
      event.stopPropagation();
      timer.enabled = !timer.enabled;
      if (timer.enabled) clearExpiredDeadline(timer);
      await saveSettings();
      renderTimers();
      scheduleTimer(timer);
      renderTimerPills();
    });

    const remove = document.createElement('button');
    remove.type = 'button';
    remove.title = 'Delete timer';
    remove.textContent = '🗑';
    remove.addEventListener('click', async (event) => {
      event.stopPropagation();
      unscheduleTimer(timer.id);
      state.settings.timedMessages = state.settings.timedMessages.filter((entry) => entry.id !== timer.id);
      await saveSettings();
      renderTimers();
      renderTimerPills();
    });

    pill.append(message, countdown, toggle, remove);
    el.timerPills.append(pill);
  });
}

async function setupLiveNotifications(host) {
  state.twitchClientId = '';
  state.twitchUserId = '';
  state.twitchRoster.loadingChannels.clear();
  state.twitchRoster.unavailableChannels.clear();
  state.liveChannels.clear();
  if (!host.toLowerCase().includes('twitch.tv')) return;

  const token = stripOauthPrefix(state.settings.profile.password);
  if (!token) return;

  try {
    const response = await fetch('https://id.twitch.tv/oauth2/validate', {
      headers: { Authorization: `OAuth ${token}` },
    });
    if (!response.ok) return;
    const data = await response.json();
    state.twitchClientId = data.client_id || '';
    state.twitchUserId = data.user_id || '';
  } catch {
    state.twitchClientId = '';
    state.twitchUserId = '';
  }

  loadKnownTwitchChatters();
  scheduleLivePolling();
}

function stripOauthPrefix(password) {
  return (password || '').replace(/^oauth:/i, '').trim();
}

function scheduleLivePolling() {
  stopLivePolling();
  if (!shouldPollLiveChannels()) {
    state.liveChannels.clear();
    renderChannels();
    return;
  }
  if (!state.connected || !state.twitchClientId) return;

  pollLiveChannels();
  state.livePollHandle = setInterval(pollLiveChannels, 60000);
}

function shouldPollLiveChannels() {
  return Boolean(state.settings.preferences.notifyOnLive || state.settings.preferences.moveLiveTabsToFront);
}

function stopLivePolling() {
  if (state.livePollHandle) clearInterval(state.livePollHandle);
  state.livePollHandle = null;
}

async function pollLiveChannels() {
  const token = stripOauthPrefix(state.settings.profile.password);
  if (!token || !state.twitchClientId) return;

  const logins = uniqueChannels([...state.channels, ...state.settings.connection.autoJoinChannels])
    .map((channel) => channel.replace(/^#/, '').toLowerCase())
    .filter(Boolean)
    .slice(0, 100);
  if (logins.length === 0) return;

  const params = logins.map((login) => `user_login=${encodeURIComponent(login)}`).join('&');
  try {
    const response = await fetch(`https://api.twitch.tv/helix/streams?${params}`, {
      headers: {
        'Client-Id': state.twitchClientId,
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) return;
    const data = await response.json();
    const nowLive = new Set((data.data || []).map((stream) => stream.user_login.toLowerCase()));

    for (const login of nowLive) {
      if (state.settings.preferences.notifyOnLive && !state.liveChannels.has(login)) {
        notifyChannelLive(login, data.data.find((s) => s.user_login.toLowerCase() === login));
      }
    }
    state.liveChannels = nowLive;
    renderChannels();
    renderStreamPlayer();
  } catch {
    // Network hiccup; try again on the next poll.
  }
}

function loadKnownTwitchChatters() {
  state.sevenTv.roomIdsByChannel.forEach((roomId, channel) => {
    loadTwitchChatters(channel, roomId);
  });
}

async function loadTwitchChatters(channel, roomId) {
  const normalized = normalizeChannel(channel);
  const token = stripOauthPrefix(state.settings.profile.password);
  if (!normalized || !roomId || !token || !state.twitchClientId || !state.twitchUserId) return;
  if (state.twitchRoster.loadingChannels.has(normalized)) return;

  state.twitchRoster.loadingChannels.add(normalized);
  try {
    const chatters = [];
    let cursor = '';
    for (let page = 0; page < 5; page += 1) {
      const result = await window.macIRC.getTwitchChatters({
        token,
        clientId: state.twitchClientId,
        broadcasterId: roomId,
        moderatorId: state.twitchUserId,
        after: cursor,
      });

      if (!result.ok) {
        if (!state.twitchRoster.unavailableChannels.has(normalized)) {
          state.twitchRoster.unavailableChannels.add(normalized);
          appendStatus(
            `Twitch roster unavailable for ${normalized}: token needs moderator:read:chatters and broadcaster/mod access.`,
            'info'
          );
        }
        return;
      }

      chatters.push(...(result.data?.data || []));
      cursor = result.data?.pagination?.cursor || '';
      if (!cursor) break;
    }

    const names = chatters
      .map((user) => user.user_name || user.user_login)
      .filter(Boolean);
    if (names.length > 0) setRosterUsers(normalized, names);
  } finally {
    state.twitchRoster.loadingChannels.delete(normalized);
  }
}

function notifyChannelLive(login, stream) {
  appendStatus(`${login} is now live: ${stream?.title || ''}`.trim(), 'success');
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(`${login} is live!`, { body: stream?.title || stream?.game_name || 'Streaming now on Twitch.' });
  }
}

function formatTimerInterval(timer) {
  const minutes = Number(timer.minutes || 0);
  const seconds = Number(timer.seconds || 0);
  const parts = [];
  if (minutes > 0) parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
  if (seconds > 0) parts.push(`${seconds} second${seconds === 1 ? '' : 's'}`);
  return parts.join(' ') || '1 second';
}

function renderPopupEditor() {
  el.popupList.innerHTML = '';
  state.settings.popups.forEach((popup, index) => {
    const item = document.createElement('div');
    item.className = 'editor-item';
    item.innerHTML = `<strong>${escapeHtml(popup.label)}</strong><code>${escapeHtml(popup.command)}</code>`;
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Remove';
    remove.addEventListener('click', async () => {
      state.settings.popups.splice(index, 1);
      await saveSettings();
      renderPopups();
    });
    item.append(remove);
    el.popupList.append(item);
  });
}

function appendMessage(event) {
  if (event.direction === 'out') addRosterUser(event.target, event.nick, event.role, { roleKnown: Boolean(event.role) });
  const target = normalizeChannel(event.target);
  const role = event.roleKnown ? (event.role || '') : (event.role || rememberedUserRole(target, event.nick));
  const entry = {
    kind: 'message',
    direction: event.direction || '',
    target,
    nick: event.nick,
    role,
    text: event.text,
    twitchEmotes: Array.isArray(event.twitchEmotes) ? event.twitchEmotes : [],
    timestamp: event.timestamp,
  };
  storeMessage(event.target, entry);
  logMonitoredMessage(entry);
  logChannelMessage(event.target, entry);
  if (normalizeChannel(event.target) !== state.activeChannel) return;
  renderMessages();
}

function logMonitoredMessage(entry) {
  const monitor = state.monitored.get(entry.nick?.toLowerCase());
  if (!monitor || !monitor.logPath) return;
  window.macIRC.appendLog(monitor.logPath, formatLogLine(entry));
}

function logChannelMessage(target, entry) {
  const prefs = state.settings.preferences;
  if (!prefs.channelLogging || !prefs.channelLogFolder) return;
  const filename = (normalizeChannel(target) || 'server').replace(/^#/, '') || 'server';
  window.macIRC.appendLog(`${prefs.channelLogFolder}/${filename}.log`, formatLogLine(entry));
}

function notifyOnMention(event) {
  if (event.direction !== 'in' || !state.settings.preferences.notifyOnMention) return;
  if (!messageMentionsNick(event.text)) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification(`${event.nick} mentioned you`, { body: event.text });
}

function renderMessages() {
  el.messages.innerHTML = '';
  const messages = state.messagesByTarget.get(state.activeChannel) || [];
  let visibleMessageCount = 0;
  messages.forEach((entry) => {
    if (entry.kind === 'message' && isHidden(entry.nick || '')) return;
    if (entry.kind === 'status') {
      renderStatusRow(entry);
    } else {
      renderMessageRow(entry);
      visibleMessageCount += 1;
    }
  });
  renderChatEmptyState(visibleMessageCount);
  renderChannelStatusStrip();
  el.messages.scrollTop = el.messages.scrollHeight;
}

function renderChatEmptyState(visibleMessageCount) {
  if (!state.activeChannel || state.activeChannel === 'server' || visibleMessageCount >= 3) return;
  const empty = document.createElement('div');
  empty.className = 'chat-empty-state';
  const title = document.createElement('div');
  title.className = 'chat-empty-state-title';
  title.textContent = `Waiting for messages in ${state.activeChannel}`;
  const hint = document.createElement('div');
  hint.className = 'chat-empty-state-hint';
  hint.textContent = 'Try sending a message, using a popup, or switching channels.';
  empty.append(title, hint);
  el.messages.append(empty);
}

function renderMessageRow(event) {
  const row = document.createElement('div');
  const isMention = event.direction === 'in' && messageMentionsNick(event.text);
  row.className = `message ${event.direction || ''}${isMention ? ' mention' : ''}${isMonitored(event.nick || '') ? ' monitored' : ''}`;
  const time = document.createElement('span');
  time.className = 'time';
  time.textContent = formatTime(event.timestamp);
  const nick = document.createElement('span');
  nick.className = `nick${event.role ? ` ${event.role}` : ''}`;
  appendRoleIcon(nick, event.role);
  nick.append(document.createTextNode(event.nick));
  const text = document.createElement('span');
  text.className = 'text';
  renderMessageText(text, event.text, event.target || state.activeChannel, event.twitchEmotes);
  row.append(time, nick, text);
  el.messages.append(row);
}

function messageMentionsNick(text) {
  const nick = state.settings?.profile?.nick;
  if (!nick) return false;
  const escapedNick = nick.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^A-Za-z0-9_])${escapedNick}([^A-Za-z0-9_]|$)`, 'i').test(text || '');
}

function nickMatchesSelf(nick) {
  return Boolean(nick && state.settings?.profile?.nick && nick.toLowerCase() === state.settings.profile.nick.toLowerCase());
}

function appendStatus(text, level = 'info') {
  storeMessage('server', {
    kind: 'status',
    text,
    level,
    timestamp: Date.now(),
  });
  if (state.activeChannel !== 'server') {
    state.unreadChannels.add('server');
    renderChannels();
    return;
  }
  renderMessages();
}

function renderStatusRow(entry) {
  const row = document.createElement('div');
  row.className = `message status ${entry.level === 'error' ? 'error' : ''}`;
  row.innerHTML = `<span class="time">${formatTime(entry.timestamp)}</span><span class="nick">server</span><span class="text">${escapeHtml(entry.text || '')}</span>`;
  el.messages.append(row);
}

function appendRaw(event) {
  const row = document.createElement('div');
  row.className = `raw-line ${event.type === 'raw-in' ? 'in' : 'out'}`;
  row.textContent = `${formatTime(event.timestamp)} ${event.type === 'raw-in' ? '<-' : '->'} ${event.line}`;
  el.rawLog.append(row);
  el.rawLog.scrollTop = el.rawLog.scrollHeight;
}

function addChannel(channel) {
  const normalized = normalizeChannel(channel);
  if (!normalized || !normalized.startsWith('#')) return;
  if (!state.channels.includes(normalized)) state.channels.push(normalized);
  if (!state.activeChannel) state.activeChannel = normalized;
  renderChannels();
  renderChatActions();
}

function leaveChannel(channel) {
  const normalized = normalizeChannel(channel);
  if (!normalized || normalized === 'server') return;
  if (state.connected) window.macIRC.send({ target: normalized, text: `/part ${normalized}` });
  removeJoinedChannel(normalized);
}

function removeJoinedChannel(channel) {
  const normalized = normalizeChannel(channel);
  if (!normalized) return;
  const hadChannel = state.channels.includes(normalized);
  state.channels = state.channels.filter((entry) => entry !== normalized);
  state.settings.connection.channelOrder = (state.settings.connection.channelOrder || [])
    .filter((entry) => normalizeChannel(entry) !== normalized);
  state.rosters.delete(normalized);
  state.unreadChannels.delete(normalized);
  if (state.activeChannel === normalized) {
    state.activeChannel = state.channels[0] || 'server';
  }
  if (state.settings.appearance.twitchPlayerChannel === normalized.replace(/^#/, '')) {
    saveCurrentStreamPlayerState();
    state.settings.appearance.twitchPlayerChannel = streamChannelFromActiveChannel();
  }
  if (hadChannel) saveSettings();
  renderChannels();
  renderRoster();
  renderMessages();
  renderStreamPlayer();
  renderChatActions();
}

function storeMessage(target, entry) {
  const normalized = target === 'server' ? 'server' : (normalizeChannel(target) || 'server');
  if (!state.messagesByTarget.has(normalized)) state.messagesByTarget.set(normalized, []);
  const messages = state.messagesByTarget.get(normalized);
  messages.push(entry);
  if (messages.length > 500) messages.splice(0, messages.length - 500);
  scheduleHistorySave();
}

let historySaveTimer = null;

function scheduleHistorySave() {
  if (!state.settings.preferences.chatHistoryEnabled) return;
  clearTimeout(historySaveTimer);
  historySaveTimer = setTimeout(() => {
    const snapshot = {};
    state.messagesByTarget.forEach((messages, channel) => {
      snapshot[channel] = messages;
    });
    window.macIRC.setHistory(snapshot);
  }, 800);
}

function setRosterUsers(channel, nicks) {
  const normalized = normalizeChannel(channel);
  if (!normalized) return;
  const roster = rosterFor(normalized);
  nicks.forEach((nick) => {
    if (nick) {
      setRosterUser(normalized, roster, nick);
      rememberChatter(nick);
    }
  });
  if (normalized === state.activeChannel) renderRoster();
}

function addRosterUser(channel, nick, role = '', options = {}) {
  const normalized = normalizeChannel(channel);
  if (!normalized || !nick) return;
  if (options.roleKnown) rememberUserRole(normalized, nick, role);
  setRosterUser(normalized, rosterFor(normalized), nick, role, options);
  rememberChatter(nick);
  if (normalized === state.activeChannel) renderRoster();
}

function removeRosterUser(channel, nick) {
  const normalized = normalizeChannel(channel);
  if (!normalized || !nick) return;
  const roster = state.rosters.get(normalized);
  if (!roster) return;
  roster.delete(nick.toLowerCase());
  if (normalized === state.activeChannel) renderRoster();
}

function removeRosterUserFromAllChannels(nick) {
  if (!nick) return;
  for (const [channel, roster] of state.rosters.entries()) {
    roster.delete(nick.toLowerCase());
    if (channel === state.activeChannel) renderRoster();
  }
}

function rosterFor(channel) {
  if (!state.rosters.has(channel)) state.rosters.set(channel, new Map());
  return state.rosters.get(channel);
}

function setRosterUser(channel, roster, nick, role = '', options = {}) {
  const key = nick.toLowerCase();
  const existing = roster.get(key);
  const remembered = rememberedUserRole(channel, nick);
  const nextRole = options.roleKnown ? (role || '') : (role || remembered || existing?.role || '');
  roster.set(key, {
    nick: existing?.nick || nick,
    role: nextRole,
  });
}

function rememberUserRole(channel, nick, role) {
  if (!channel || !nick) return;
  if (!state.roleMemory.has(channel)) state.roleMemory.set(channel, new Map());
  const roles = state.roleMemory.get(channel);
  const key = nick.toLowerCase();

  if (isRememberedRole(role)) {
    roles.set(key, { nick, role });
  } else {
    roles.delete(key);
    if (roles.size === 0) state.roleMemory.delete(channel);
  }

  scheduleRoleMemorySave();
}

function rememberedUserRole(channel, nick) {
  return state.roleMemory.get(channel)?.get(nick.toLowerCase())?.role || '';
}

function isRememberedRole(role) {
  return role === 'mod' || role === 'vip';
}

function getRosterUser(channel, nick) {
  return state.rosters.get(channel)?.get(nick.toLowerCase()) || { nick, role: '' };
}

function appendRoleIcon(container, role) {
  if (!role) return;
  const icon = document.createElement('span');
  icon.className = `role-icon ${role}`;
  icon.setAttribute('aria-hidden', 'true');
  icon.title = role === 'mod' ? 'Moderator' : 'VIP';
  container.append(icon);
}

function markChannelUnread(channel) {
  const normalized = normalizeChannel(channel);
  if (!normalized || normalized === state.activeChannel) return;
  state.unreadChannels.add(normalized);
  renderChannels();
}

function rememberChatter(nick) {
  if (!nick || nick === state.settings?.profile?.nick) return;
  state.recentChatters = uniqueNicks([nick, ...state.recentChatters]).slice(0, 250);
}

function uniqueNicks(nicks) {
  const seen = new Set();
  const unique = [];
  nicks.forEach((nick) => {
    const key = String(nick).toLowerCase();
    if (!key || seen.has(key)) return;
    seen.add(key);
    unique.push(nick);
  });
  return unique;
}

function uniqueChannels(channels) {
  const seen = new Set();
  const unique = [];
  channels.map(normalizeChannel).filter(Boolean).forEach((channel) => {
    const key = channel.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    unique.push(channel);
  });
  return unique;
}

async function loadSevenTvEmotes(channel, roomId) {
  const normalized = normalizeChannel(channel);
  if (!state.settings.appearance.sevenTvEmotes || !normalized || !roomId) return;
  if (state.sevenTv.emotesByChannel.has(normalized) || state.sevenTv.loadingChannels.has(normalized)) return;

  state.sevenTv.loadingChannels.add(normalized);
  try {
    const response = await fetch(`https://7tv.io/v3/users/twitch/${encodeURIComponent(roomId)}`);
    if (response.status === 404) {
      state.sevenTv.emotesByChannel.set(normalized, new Map());
      return;
    }
    if (!response.ok) throw new Error(`7TV returned ${response.status}`);
    const data = await response.json();
    const emotes = new Map();
    for (const emote of data.emote_set?.emotes || []) {
      const url = sevenTvEmoteUrl(emote);
      if (emote.name && url) emotes.set(emote.name, url);
    }
    state.sevenTv.emotesByChannel.set(normalized, emotes);
    appendStatus(`Loaded ${emotes.size} 7TV emotes for ${normalized}.`, 'info');
    if (normalized === state.activeChannel) renderMessages();
  } catch (error) {
    state.sevenTv.emotesByChannel.set(normalized, new Map());
    appendStatus(`Could not load 7TV emotes: ${error.message}`, 'error');
  } finally {
    state.sevenTv.loadingChannels.delete(normalized);
  }
}

function sevenTvEmoteUrl(emote) {
  const files = emote.data?.host?.files || [];
  const file = files.find((entry) => entry.name === '2x.webp')
    || files.find((entry) => entry.name.endsWith('.webp'))
    || files[0];
  if (!file) return '';
  const host = emote.data.host.url || `//cdn.7tv.app/emote/${emote.id}`;
  return `https:${host}/${file.name}`;
}

function renderMessageText(container, text, channel, twitchEmotes = []) {
  const sevenTvEmotes = state.settings.appearance.sevenTvEmotes
    ? state.sevenTv.emotesByChannel.get(normalizeChannel(channel))
    : null;

  const normalizedText = String(text || '');
  const twitchRanges = normalizeTwitchEmoteRanges(twitchEmotes, normalizedText);
  let cursor = 0;
  twitchRanges.forEach((emote) => {
    if (emote.start > cursor) {
      appendTextWithSevenTvEmotes(container, normalizedText.slice(cursor, emote.start), sevenTvEmotes);
    }
    appendChatEmote(container, twitchEmoteUrl(emote.id), emote.name);
    cursor = emote.end + 1;
  });

  if (cursor < normalizedText.length) {
    appendTextWithSevenTvEmotes(container, normalizedText.slice(cursor), sevenTvEmotes);
  }
}

function appendTextWithSevenTvEmotes(container, text, emotes) {
  const parts = String(text || '').split(/(\s+)/);
  parts.forEach((part) => {
    if (!part) return;
    if (emotes?.has(part)) {
      appendChatEmote(container, emotes.get(part), part);
      return;
    }

    appendLinkedText(container, part);
  });
}

function normalizeTwitchEmoteRanges(emotes, text) {
  if (!Array.isArray(emotes) || emotes.length === 0) return [];

  let previousEnd = -1;
  return emotes
    .map((emote) => ({
      id: String(emote.id || ''),
      start: Number(emote.start),
      end: Number(emote.end),
      name: String(emote.name || ''),
    }))
    .filter((emote) => (
      emote.id
      && Number.isInteger(emote.start)
      && Number.isInteger(emote.end)
      && emote.start >= 0
      && emote.end >= emote.start
      && emote.end < text.length
    ))
    .sort((first, second) => first.start - second.start || first.end - second.end)
    .filter((emote) => {
      if (emote.start <= previousEnd) return false;
      previousEnd = emote.end;
      return true;
    });
}

function shiftTwitchEmotes(emotes, offset) {
  if (!Array.isArray(emotes) || !offset) return Array.isArray(emotes) ? emotes : [];
  return emotes.map((emote) => ({
    ...emote,
    start: Number(emote.start) + offset,
    end: Number(emote.end) + offset,
  }));
}

function twitchEmoteUrl(id) {
  return `https://static-cdn.jtvnw.net/emoticons/v2/${encodeURIComponent(id)}/default/dark/2.0`;
}

function appendChatEmote(container, src, label) {
  const image = document.createElement('img');
  image.className = 'chat-emote';
  image.src = src;
  image.alt = label;
  image.title = label;
  image.loading = 'lazy';
  container.append(image);
}

function appendLinkedText(container, text) {
  const matches = String(text).matchAll(/https?:\/\/[^\s]+/g);
  let lastIndex = 0;
  for (const match of matches) {
    if (match.index > lastIndex) {
      container.append(document.createTextNode(text.slice(lastIndex, match.index)));
    }
    const link = document.createElement('a');
    link.href = match[0];
    link.target = '_blank';
    link.rel = 'noreferrer';
    link.textContent = match[0];
    container.append(link);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) container.append(document.createTextNode(text.slice(lastIndex)));
}

function activateTab(name) {
  saveCurrentStreamPlayerState();
  document.querySelectorAll('.tab').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.tab === name);
  });
  document.querySelectorAll('.view').forEach((view) => view.classList.remove('is-active'));
  document.querySelector(`#${name}Tab`).classList.add('is-active');
}

function normalizeChannel(channel) {
  const trimmed = (channel || '').trim();
  if (!trimmed) return '';
  return trimmed.startsWith('#') ? trimmed : `#${trimmed}`;
}

function isServerTarget(target) {
  const value = String(target || '').trim().toLowerCase();
  return value === 'server' || value === '#server';
}

function normalizeCommandName(name) {
  return (name || '').trim().replace(/^\//, '').toLowerCase();
}

function formatTime(timestamp) {
  return new Date(timestamp || Date.now()).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function linkify(value) {
  return value.replace(/https?:\/\/[^\s]+/g, (url) => `<a href="${url}" target="_blank" rel="noreferrer">${url}</a>`);
}
