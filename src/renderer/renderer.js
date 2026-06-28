const state = {
  settings: null,
  activeChannel: '',
  channels: [],
  unreadChannels: new Set(),
  mentionedChannels: new Set(),
  mentions: [],
  mentionsPanel: { open: false },
  messagesByTarget: new Map(),
  rosters: new Map(),
  roleMemory: new Map(),
  sevenTv: {
    emotesByChannel: new Map(),
    loadingChannels: new Set(),
    roomIdsByChannel: new Map(),
  },
  twitchEmotes: {
    global: null,
    byChannel: new Map(),
    loadingChannels: new Set(),
  },
  emotePicker: { open: false, source: 'twitch', search: '' },
  recentChatters: [],
  nickSuggestion: '',
  commandSuggestion: '',
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
  streamDetails: new Map(),
  livePollHandle: null,
  draggedChannel: '',
  userStats: new Map(),
  userDrawer: { open: false, channel: '', nick: '' },
  commandPalette: { open: false, query: '', selectedIndex: 0, results: [] },
  channelSettings: { open: false, channel: '' },
  onboarding: { open: false, step: 0, draft: {} },
  sentMessages: [],
  sentMessageIndex: -1,
  pendingNewMessages: 0,
};

const el = {
  connectionStatus: document.querySelector('#connectionStatus'),
  connectionState: document.querySelector('#connectionState'),
  connectionServer: document.querySelector('#connectionServer'),
  connectionNick: document.querySelector('#connectionNick'),
  connectionChannelCount: document.querySelector('#connectionChannelCount'),
  openLogFolderButton: document.querySelector('#openLogFolderButton'),
  connectionToggleButton: document.querySelector('#connectionToggleButton'),
  joinChannelForm: document.querySelector('#joinChannelForm'),
  joinChannelInput: document.querySelector('#joinChannelInput'),
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
  streamLatency: document.querySelector('#streamLatency'),
  streamCatchUpButton: document.querySelector('#streamCatchUpButton'),
  streamToggleButton: document.querySelector('#streamToggleButton'),
  streamToolbar: document.querySelector('#streamToolbar'),
  streamResizeGrip: document.querySelector('#streamResizeGrip'),
  streamDockSlot: document.querySelector('#streamDockSlot'),
  appShell: document.querySelector('.app-shell'),
  autoJoinList: document.querySelector('#autoJoinList'),
  autoJoinForm: document.querySelector('#autoJoinForm'),
  autoJoinChannel: document.querySelector('#autoJoinChannel'),
  twitchPresetButton: document.querySelector('#twitchPresetButton'),
  twitchTokenButton: document.querySelector('#twitchTokenButton'),
  connectButton: document.querySelector('#connectButton'),
  disconnectButton: document.querySelector('#disconnectButton'),
  disconnectedBackdrop: document.querySelector('#disconnectedBackdrop'),
  disconnectedMessage: document.querySelector('#disconnectedMessage'),
  disconnectedReconnectButton: document.querySelector('#disconnectedReconnectButton'),
  disconnectedDismissButton: document.querySelector('#disconnectedDismissButton'),
  dashboardTab: document.querySelector('#dashboardTab'),
  dashboardSort: document.querySelector('#dashboardSort'),
  dashboardFilters: document.querySelector('#dashboardFilters'),
  dashboardGrid: document.querySelector('#dashboardGrid'),
  chatTab: document.querySelector('#chatTab'),
  channels: document.querySelector('#channels'),
  streamInfoHeader: document.querySelector('#streamInfoHeader'),
  topicBar: document.querySelector('#topicBar'),
  channelStatusStrip: document.querySelector('#channelStatusStrip'),
  messages: document.querySelector('#messages'),
  chatBody: document.querySelector('.chat-body'),
  chatStreamSlot: document.querySelector('#chatStreamSlot'),
  streamEmptyState: document.querySelector('#streamEmptyState'),
  rosterToggleButton: document.querySelector('#rosterToggleButton'),
  layoutOptions: document.querySelectorAll('.layout-option'),
  rosterPanel: document.querySelector('.roster-panel'),
  roster: document.querySelector('#roster'),
  rosterCount: document.querySelector('#rosterCount'),
  popupBar: document.querySelector('#popupBar'),
  chatActionBar: document.querySelector('.chat-action-bar'),
  addAutoJoinCurrentButton: document.querySelector('#addAutoJoinCurrentButton'),
  inputForm: document.querySelector('#inputForm'),
  messageInput: document.querySelector('#messageInput'),
  nickSuggest: document.querySelector('#nickSuggest'),
  newMessagesButton: document.querySelector('#newMessagesButton'),
  emoteButton: document.querySelector('#emoteButton'),
  mentionsButton: document.querySelector('#mentionsButton'),
  mentionsBackdrop: document.querySelector('#mentionsBackdrop'),
  mentionsModal: document.querySelector('#mentionsModal'),
  mentionsModalClose: document.querySelector('#mentionsModalClose'),
  mentionsList: document.querySelector('#mentionsList'),
  mentionsClearButton: document.querySelector('#mentionsClearButton'),
  emotePicker: document.querySelector('#emotePicker'),
  emotePickerSearch: document.querySelector('#emotePickerSearch'),
  emotePickerGrid: document.querySelector('#emotePickerGrid'),
  emotePickerTabs: document.querySelectorAll('.emote-picker-tab'),
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
  whatsnewList: document.querySelector('#whatsnewList'),
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
  channelSettingsList: document.querySelector('#channelSettingsList'),
  showTimestampsToggle: document.querySelector('#showTimestampsToggle'),
  showBadgesToggle: document.querySelector('#showBadgesToggle'),
  showEmotesToggle: document.querySelector('#showEmotesToggle'),
  showSystemMessagesToggle: document.querySelector('#showSystemMessagesToggle'),
  highlightMentionsToggle: document.querySelector('#highlightMentionsToggle'),
  groupMessagesToggle: document.querySelector('#groupMessagesToggle'),
  hoverActionsToggle: document.querySelector('#hoverActionsToggle'),
  hoverModToolsToggle: document.querySelector('#hoverModToolsToggle'),
  reducedMotionToggle: document.querySelector('#reducedMotionToggle'),
  chatDensitySelect: document.querySelector('#chatDensitySelect'),
  chatFontSizeInput: document.querySelector('#chatFontSizeInput'),
  runOnboardingButton: document.querySelector('#runOnboardingButton'),
  resetAppButton: document.querySelector('#resetAppButton'),
  sidebarVersion: document.querySelector('#sidebarVersion'),
  appVersion: document.querySelector('#appVersion'),
  updateStatus: document.querySelector('#updateStatus'),
  checkUpdatesButton: document.querySelector('#checkUpdatesButton'),
  userDrawer: document.querySelector('#userDrawer'),
  userDrawerClose: document.querySelector('#userDrawerClose'),
  userDrawerName: document.querySelector('#userDrawerName'),
  userDrawerDisplayName: document.querySelector('#userDrawerDisplayName'),
  userDrawerBadges: document.querySelector('#userDrawerBadges'),
  userDrawerMessageCount: document.querySelector('#userDrawerMessageCount'),
  userDrawerFirstSeen: document.querySelector('#userDrawerFirstSeen'),
  userDrawerLastMessage: document.querySelector('#userDrawerLastMessage'),
  userDrawerRecentMessages: document.querySelector('#userDrawerRecentMessages'),
  userDrawerNote: document.querySelector('#userDrawerNote'),
  userDrawerMention: document.querySelector('#userDrawerMention'),
  userDrawerCopy: document.querySelector('#userDrawerCopy'),
  userDrawerWhisper: document.querySelector('#userDrawerWhisper'),
  userDrawerTimeout: document.querySelector('#userDrawerTimeout'),
  userDrawerBan: document.querySelector('#userDrawerBan'),
  userDrawerUnban: document.querySelector('#userDrawerUnban'),
  userDrawerClear: document.querySelector('#userDrawerClear'),
  commandPaletteBackdrop: document.querySelector('#commandPaletteBackdrop'),
  commandPalette: document.querySelector('#commandPalette'),
  commandPaletteInput: document.querySelector('#commandPaletteInput'),
  commandPaletteResults: document.querySelector('#commandPaletteResults'),
  channelSettingsBackdrop: document.querySelector('#channelSettingsBackdrop'),
  channelSettingsClose: document.querySelector('#channelSettingsClose'),
  channelSettingsTitle: document.querySelector('#channelSettingsTitle'),
  channelSettingsSummary: document.querySelector('#channelSettingsSummary'),
  channelSettingsCopySource: document.querySelector('#channelSettingsCopySource'),
  channelSettingsCopyButton: document.querySelector('#channelSettingsCopyButton'),
  channelSettingsApplyAllButton: document.querySelector('#channelSettingsApplyAllButton'),
  channelSettingsResetButton: document.querySelector('#channelSettingsResetButton'),
  channelSettingsSections: document.querySelector('#channelSettingsSections'),
  onboardingBackdrop: document.querySelector('#onboardingBackdrop'),
  onboardingTitle: document.querySelector('#onboardingTitle'),
  onboardingProgress: document.querySelector('#onboardingProgress'),
  onboardingBody: document.querySelector('#onboardingBody'),
  onboardingSkipButton: document.querySelector('#onboardingSkipButton'),
  onboardingBackButton: document.querySelector('#onboardingBackButton'),
  onboardingNextButton: document.querySelector('#onboardingNextButton'),
  resetBackdrop: document.querySelector('#resetBackdrop'),
  resetDeleteHistory: document.querySelector('#resetDeleteHistory'),
  resetDeleteLogs: document.querySelector('#resetDeleteLogs'),
  resetDeleteBackups: document.querySelector('#resetDeleteBackups'),
  resetConfirmInput: document.querySelector('#resetConfirmInput'),
  resetConfirmButton: document.querySelector('#resetConfirmButton'),
  resetCancelButton: document.querySelector('#resetCancelButton'),
  resetStatus: document.querySelector('#resetStatus'),
};

const CHANNEL_SETTING_SECTIONS = [
  {
    title: 'General',
    fields: [
      { path: 'displayName', label: 'Custom display name', type: 'text', defaultValue: '' },
      { path: 'favorite', label: 'Favorite channel', type: 'boolean', defaultValue: false },
      { path: 'autoJoin', label: 'Auto join this channel on startup', type: 'boolean', defaultValue: false },
      { path: 'moveTabToFrontWhenLive', label: 'Move this channel tab to front when live', type: 'boolean', defaultValue: true },
    ],
  },
  {
    title: 'Chat',
    fields: [
      { path: 'chat.showBadges', label: 'Show badges', type: 'boolean', defaultValue: true },
      { path: 'chat.showTimestamps', label: 'Show timestamps', type: 'boolean', defaultValue: true },
      { path: 'chat.compactMode', label: 'Compact mode', type: 'boolean', defaultValue: false },
      { path: 'chat.fontSize', label: 'Font size', type: 'number', defaultValue: 13, min: 11, max: 22 },
      { path: 'chat.highlightMentions', label: 'Highlight mentions', type: 'boolean', defaultValue: true },
      { path: 'chat.highlightFirstTimeChatters', label: 'Highlight first-time chatters', type: 'boolean', defaultValue: false },
      { path: 'chat.highlightUsers', label: 'Highlight specific users', type: 'text', defaultValue: '', placeholder: 'nick1, nick2' },
      { path: 'chat.hideBotMessages', label: 'Hide bot messages', type: 'boolean', defaultValue: false },
      { path: 'chat.hideRepeatedMessages', label: 'Hide repeated messages', type: 'boolean', defaultValue: false },
    ],
  },
  {
    title: 'Bot',
    fields: [
      { path: 'botEnabled', label: 'Bot enabled for this channel', type: 'boolean', defaultValue: true },
      { path: 'commandsEnabled', label: 'Commands enabled for this channel', type: 'boolean', defaultValue: true },
      { path: 'timersEnabled', label: 'Timers enabled for this channel', type: 'boolean', defaultValue: true },
      { path: 'popupsEnabled', label: 'Popups enabled for this channel', type: 'boolean', defaultValue: true },
      { path: 'autoRepliesEnabled', label: 'Auto-replies enabled for this channel', type: 'boolean', defaultValue: true },
      { path: 'commandPrefix', label: 'Default command prefix', type: 'text', defaultValue: '!', placeholder: '!' },
    ],
  },
  {
    title: 'Commands',
    fields: [
      { path: 'commands.allowGlobal', label: 'Allow global commands', type: 'boolean', defaultValue: true },
      { path: 'commands.channelOnly', label: 'Channel-only command notes', type: 'textarea', defaultValue: '', placeholder: '!discord = channel-specific reply' },
      { path: 'commands.overrides', label: 'Global command overrides', type: 'textarea', defaultValue: '', placeholder: 'discord = Join this channel Discord...' },
      { path: 'commands.trackUsage', label: 'Track command usage per channel', type: 'boolean', defaultValue: true },
    ],
  },
  {
    title: 'Timers',
    fields: [
      { path: 'timers.enabled', label: 'Enable timers per channel', type: 'boolean', defaultValue: true },
      { path: 'timers.allowGlobal', label: 'Allow global timers to run here', type: 'boolean', defaultValue: true },
      { path: 'timers.pauseAll', label: 'Pause all timers for this channel', type: 'boolean', defaultValue: false },
      { path: 'timers.showNext', label: 'Show next scheduled timer message', type: 'boolean', defaultValue: true },
    ],
  },
  {
    title: 'Popups',
    fields: [
      { path: 'popups.enabled', label: 'Enable popup actions', type: 'boolean', defaultValue: true },
      { path: 'popups.visibleLabels', label: 'Only show these popup labels', type: 'text', defaultValue: '', placeholder: 'Wave, Discord' },
      { path: 'popups.channelButtons', label: 'Channel-specific popup buttons', type: 'textarea', defaultValue: '', placeholder: 'Label = message or /command' },
      { path: 'popups.order', label: 'Popup order', type: 'text', defaultValue: '', placeholder: 'Wave, Say hello, Discord' },
    ],
  },
  {
    title: 'Moderation',
    fields: [
      { path: 'moderation.enabled', label: 'Enable moderation tools', type: 'boolean', defaultValue: true },
      { path: 'moderation.showTimeoutBan', label: 'Show timeout and ban buttons', type: 'boolean', defaultValue: true },
      { path: 'moderation.linkDetection', label: 'Link detection warning', type: 'boolean', defaultValue: false },
      { path: 'moderation.capsWarning', label: 'Caps spam warning', type: 'boolean', defaultValue: false },
      { path: 'moderation.repeatedWarning', label: 'Repeated message warning', type: 'boolean', defaultValue: false },
      { path: 'moderation.confirmActions', label: 'Require confirmation before moderation actions', type: 'boolean', defaultValue: true },
    ],
  },
  {
    title: 'Logs',
    fields: [
      { path: 'logs.enabled', label: 'Enable logging for this channel', type: 'boolean', defaultValue: true },
      { path: 'logs.notes', label: 'Local log notes', type: 'textarea', defaultValue: '', placeholder: 'Private notes about this channel log' },
    ],
  },
  {
    title: 'Notifications',
    fields: [
      { path: 'notifications.goLive', label: 'Notify when channel goes live', type: 'boolean', defaultValue: false },
      { path: 'notifications.mentions', label: 'Notify when mentioned', type: 'boolean', defaultValue: false },
      { path: 'notifications.specificUsers', label: 'Notify when specific users chat', type: 'text', defaultValue: '', placeholder: 'nick1, nick2' },
      { path: 'notifications.raids', label: 'Notify on raids if detected', type: 'boolean', defaultValue: false },
      { path: 'notifications.firstAfterInactivity', label: 'Notify on first message after inactivity', type: 'boolean', defaultValue: false },
    ],
  },
  {
    title: 'Stream Preview',
    fields: [
      { path: 'stream.showPreview', label: 'Show stream preview for this channel', type: 'boolean', defaultValue: true },
      { path: 'stream.autoOpenWhenLive', label: 'Auto-open stream preview when live', type: 'boolean', defaultValue: false },
      { path: 'stream.muteByDefault', label: 'Mute stream by default', type: 'boolean', defaultValue: false },
      { path: 'stream.rememberVolume', label: 'Remember volume per channel', type: 'boolean', defaultValue: true },
      { path: 'stream.volume', label: 'Default volume', type: 'number', defaultValue: 0.5, min: 0, max: 1, step: 0.05 },
    ],
  },
];

const CHANNEL_SETTING_FIELDS = CHANNEL_SETTING_SECTIONS.flatMap((section) => section.fields);

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
  if (!state.settings.onboarding.completed && !state.settings.onboarding.skipped) {
    setTimeout(() => openOnboarding(), 450);
  }
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
  state.settings.appearance.twitchPlayerDocked ??= true;
  state.settings.appearance.layout ||= 'standard';
  state.settings.appearance.twitchPlayerBounds ||= null;
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
  state.settings.channels ||= {};
  state.settings.onboarding ||= {};
  state.settings.onboarding.completed ??= false;
  state.settings.onboarding.skipped ??= false;
  state.settings.onboarding.completedAt ??= null;
  state.settings.preferences ||= {};
  state.settings.preferences.chatHistoryEnabled ??= true;
  state.settings.preferences.channelLogging ??= false;
  state.settings.preferences.channelLogFolder ??= '';
  state.settings.preferences.notifyOnMention ??= false;
  state.settings.preferences.notifyOnLive ??= false;
  state.settings.preferences.moveLiveTabsToFront ??= true;
  state.settings.preferences.dashboardSort ||= 'live';
  state.settings.preferences.dashboardFilter ||= 'all';
  state.settings.preferences.dashboardStreamStatus ??= true;
  state.settings.preferences.chatDisplay ||= {};
  state.settings.preferences.chatDisplay.showTimestamps ??= true;
  state.settings.preferences.chatDisplay.showBadges ??= true;
  state.settings.preferences.chatDisplay.showEmotes ??= true;
  state.settings.preferences.chatDisplay.showSystemMessages ??= true;
  state.settings.preferences.chatDisplay.highlightMentions ??= true;
  state.settings.preferences.chatDisplay.groupMessages ??= false;
  state.settings.preferences.chatDisplay.density ||= 'comfortable';
  state.settings.preferences.chatDisplay.fontSize ??= 13;
  state.settings.preferences.chatDisplay.hoverActions ??= true;
  state.settings.preferences.chatDisplay.hoverModTools ??= true;
  state.settings.preferences.chatDisplay.reducedMotion ??= false;
  state.settings.preferences.recentCommandPaletteActions ||= [];
  state.settings.preferences.hiddenChats ||= {};
  state.settings.preferences.roleMemory ||= {};
  state.settings.preferences.userNotes ||= {};
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
  el.dashboardSort.value = state.settings.preferences.dashboardSort;
  hydrateChatDisplaySettings();
  setDashboardFilter(state.settings.preferences.dashboardFilter || 'all', { save: false });
  updateChannelLogFolderLabel();
  applyTheme(state.settings.appearance.theme);
  applyLayout(state.settings.appearance.layout);
  state.activeChannel = quick.channel;
}

function updateChannelLogFolderLabel() {
  el.channelLogFolder.textContent = state.settings.preferences.channelLogFolder
    ? `Logging to ${state.settings.preferences.channelLogFolder}`
    : 'No folder selected.';
}

function hydrateChatDisplaySettings() {
  const display = state.settings.preferences.chatDisplay;
  el.showTimestampsToggle.checked = display.showTimestamps;
  el.showBadgesToggle.checked = display.showBadges;
  el.showEmotesToggle.checked = display.showEmotes;
  el.showSystemMessagesToggle.checked = display.showSystemMessages;
  el.highlightMentionsToggle.checked = display.highlightMentions;
  el.groupMessagesToggle.checked = display.groupMessages;
  el.hoverActionsToggle.checked = display.hoverActions;
  el.hoverModToolsToggle.checked = display.hoverModTools;
  el.reducedMotionToggle.checked = display.reducedMotion;
  el.chatDensitySelect.value = display.density;
  el.chatFontSizeInput.value = String(display.fontSize);
  document.body.classList.toggle('reduced-motion', display.reducedMotion);
}

function bindChatDisplaySetting(control, key, mode) {
  control.addEventListener('change', async () => {
    const value = mode === 'checked'
      ? control.checked
      : (mode === 'number' ? Number(control.value || 13) : control.value);
    state.settings.preferences.chatDisplay[key] = value;
    document.body.classList.toggle('reduced-motion', state.settings.preferences.chatDisplay.reducedMotion);
    await saveSettings();
    renderMessages({ forceScroll: chatIsAtBottom() });
  });
}

function rememberSentInput(input) {
  const trimmed = input.trim();
  if (!trimmed) return;
  state.sentMessages = [trimmed, ...state.sentMessages.filter((entry) => entry !== trimmed)].slice(0, 50);
  state.sentMessageIndex = -1;
}

function recallSentInput(event, direction) {
  if (state.sentMessages.length === 0) return;
  event.preventDefault();
  state.sentMessageIndex = Math.min(state.sentMessages.length - 1, Math.max(-1, state.sentMessageIndex + (direction < 0 ? 1 : -1)));
  el.messageInput.value = state.sentMessageIndex >= 0 ? state.sentMessages[state.sentMessageIndex] : '';
  el.messageInput.setSelectionRange(el.messageInput.value.length, el.messageInput.value.length);
}

function openOnboarding({ rerun = false } = {}) {
  state.onboarding = {
    open: true,
    step: 0,
    draft: onboardingDraftFromSettings(),
    rerun,
  };
  el.onboardingBackdrop.hidden = false;
  renderOnboarding();
}

function onboardingDraftFromSettings() {
  return {
    nick: state.settings.profile.nick || '',
    password: state.settings.profile.password || '',
    channels: uniqueChannels([state.settings.quickConnect.channel, ...state.settings.connection.autoJoinChannels]).filter(Boolean),
    autoJoin: true,
    moveLive: state.settings.preferences.moveLiveTabsToFront,
    streamPreview: state.settings.appearance.twitchPlayer,
    userList: !el.rosterPanel.hidden,
    compact: state.settings.preferences.chatDisplay.density === 'compact',
    timestamps: state.settings.preferences.chatDisplay.showTimestamps,
    badges: state.settings.preferences.chatDisplay.showBadges,
    sevenTv: state.settings.appearance.sevenTvEmotes,
    layoutStyle: state.settings.appearance.layout || 'standard',
    starterDiscord: false,
    starterLurk: false,
    starterTimer: false,
    starterWave: false,
    notifications: state.settings.preferences.notifyOnMention,
    logs: state.settings.preferences.channelLogging,
    connectionStatus: '',
  };
}

function renderOnboarding() {
  const steps = [
    renderOnboardingWelcome,
    renderOnboardingConnection,
    renderOnboardingChannels,
    renderOnboardingLayout,
    renderOnboardingStarterTools,
    renderOnboardingFinish,
  ];
  el.onboardingProgress.textContent = `Step ${state.onboarding.step + 1} of ${steps.length}`;
  el.onboardingBackButton.disabled = state.onboarding.step === 0;
  el.onboardingSkipButton.hidden = state.onboarding.step === steps.length - 1;
  el.onboardingNextButton.textContent = state.onboarding.step === steps.length - 1 ? 'Open ClovaChat' : (state.onboarding.step === 0 ? 'Get Started' : 'Next');
  el.onboardingBody.innerHTML = '';
  steps[state.onboarding.step]();
}

function onboardingField(id, label, value, type = 'text') {
  const wrapper = document.createElement('label');
  wrapper.textContent = label;
  const input = document.createElement('input');
  input.id = id;
  input.type = type;
  input.value = value || '';
  input.addEventListener('input', () => {
    state.onboarding.draft[id.replace(/^onboarding/, '').replace(/^[A-Z]/, (match) => match.toLowerCase())] = input.value;
  });
  wrapper.append(input);
  return wrapper;
}

function onboardingCheck(key, label) {
  const wrapper = document.createElement('label');
  wrapper.className = 'check-row';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = Boolean(state.onboarding.draft[key]);
  input.addEventListener('change', () => {
    state.onboarding.draft[key] = input.checked;
  });
  wrapper.append(input, document.createTextNode(label));
  return wrapper;
}

function renderOnboardingWelcome() {
  el.onboardingTitle.textContent = 'Welcome to ClovaChat';
  el.onboardingBody.innerHTML = '<p>A modern Twitch chat client with stream preview, bot tools, commands, timers, popups, logs, and multi-channel support.</p>';
}

function renderOnboardingConnection() {
  el.onboardingTitle.textContent = 'Connect to Twitch Chat';
  el.onboardingBody.append(
    onboardingField('onboardingNick', 'Twitch username / nickname', state.onboarding.draft.nick),
    onboardingField('onboardingPassword', 'OAuth token', state.onboarding.draft.password, 'password')
  );
  const row = document.createElement('div');
  row.className = 'button-row';
  const test = document.createElement('button');
  test.type = 'button';
  test.textContent = 'Test Connection';
  test.addEventListener('click', () => {
    state.onboarding.draft.connectionStatus = state.onboarding.draft.nick ? `Ready to connect as ${state.onboarding.draft.nick}` : 'Enter a Twitch username first.';
    renderOnboarding();
  });
  const save = document.createElement('button');
  save.type = 'button';
  save.textContent = 'Save Connection';
  save.addEventListener('click', () => saveOnboardingConnection());
  row.append(test, save);
  const status = document.createElement('p');
  status.className = 'settings-hint';
  status.textContent = state.onboarding.draft.connectionStatus || 'Server defaults to irc.chat.twitch.tv on port 6697 with TLS.';
  el.onboardingBody.append(row, status);
}

function renderOnboardingChannels() {
  el.onboardingTitle.textContent = 'Add Channels to Join';
  const form = document.createElement('div');
  form.className = 'onboarding-channel-add';
  const input = document.createElement('input');
  input.placeholder = '#channel';
  const add = document.createElement('button');
  add.type = 'button';
  add.textContent = 'Add';
  add.addEventListener('click', () => {
    const channel = normalizeChannel(input.value);
    if (channel) state.onboarding.draft.channels = uniqueChannels([...state.onboarding.draft.channels, channel]);
    input.value = '';
    renderOnboarding();
  });
  form.append(input, add);
  const list = document.createElement('div');
  list.className = 'onboarding-channel-list';
  state.onboarding.draft.channels.forEach((channel) => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.textContent = `${channel} ×`;
    pill.addEventListener('click', () => {
      state.onboarding.draft.channels = state.onboarding.draft.channels.filter((entry) => entry !== channel);
      renderOnboarding();
    });
    list.append(pill);
  });
  el.onboardingBody.append(form, list, onboardingCheck('autoJoin', 'Auto join these channels on startup'), onboardingCheck('moveLive', 'Move live channels to the front'));
}

function renderOnboardingLayout() {
  el.onboardingTitle.textContent = 'Choose Your Chat Layout';
  el.onboardingBody.append(onboardingLayoutStylePicker());
  el.onboardingBody.append(
    onboardingCheck('streamPreview', 'Stream preview on'),
    onboardingCheck('userList', 'User list on'),
    onboardingCheck('compact', 'Compact chat mode'),
    onboardingCheck('timestamps', 'Show timestamps'),
    onboardingCheck('badges', 'Show badges'),
    onboardingCheck('sevenTv', 'Enable 7TV emotes')
  );
  const preview = document.createElement('div');
  preview.className = 'onboarding-preview-card';
  preview.textContent = '[11:42 PM] mod_username: Welcome to ClovaChat Kappa';
  el.onboardingBody.append(preview);
}

// Placeholder hand-drawn frames standing in for real screenshots/PNGs that
// may replace these previews later — see Settings > Layout for the same
// frame style used outside onboarding.
function onboardingLayoutStylePicker() {
  const wrapper = document.createElement('div');
  wrapper.className = 'layout-options onboarding-layout-options';

  const options = [
    {
      value: 'standard',
      title: 'Standard',
      desc: 'Chat and user list side by side. Stream preview lives in the sidebar.',
      frame: 'standard',
    },
    {
      value: 'twitchStyle',
      title: 'Twitch Style',
      desc: 'Stream in the middle, chat on the right. The user list tucks behind an icon.',
      frame: 'twitch',
    },
  ];

  options.forEach((option) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'layout-option';
    button.classList.toggle('is-active', state.onboarding.draft.layoutStyle === option.value);

    const frame = document.createElement('span');
    frame.className = `layout-option-preview layout-preview-${option.frame}`;
    if (option.frame === 'standard') {
      frame.append(
        Object.assign(document.createElement('span'), { className: 'layout-preview-chat' }),
        Object.assign(document.createElement('span'), { className: 'layout-preview-users' })
      );
    } else {
      frame.append(
        Object.assign(document.createElement('span'), { className: 'layout-preview-stream' }),
        Object.assign(document.createElement('span'), { className: 'layout-preview-chat' })
      );
    }

    const title = document.createElement('span');
    title.className = 'layout-option-title';
    title.textContent = option.title;
    const desc = document.createElement('span');
    desc.className = 'layout-option-desc';
    desc.textContent = option.desc;

    button.append(frame, title, desc);
    button.addEventListener('click', () => {
      state.onboarding.draft.layoutStyle = option.value;
      renderOnboarding();
    });
    wrapper.append(button);
  });

  return wrapper;
}

function renderOnboardingStarterTools() {
  el.onboardingTitle.textContent = 'Set Up Starter Tools';
  el.onboardingBody.append(
    onboardingCheck('starterDiscord', 'Add !discord command'),
    onboardingCheck('starterLurk', 'Add !lurk command'),
    onboardingCheck('starterTimer', 'Add follow reminder timer'),
    onboardingCheck('starterWave', 'Add wave popup button'),
    onboardingCheck('notifications', 'Enable desktop notifications'),
    onboardingCheck('logs', 'Enable channel logs')
  );
}

function renderOnboardingFinish() {
  el.onboardingTitle.textContent = 'You’re Ready';
  const draft = state.onboarding.draft;
  el.onboardingBody.innerHTML = `<div class="onboarding-summary">
    <strong>Connected account</strong><span>${escapeHtml(draft.nick || 'Not set')}</span>
    <strong>Channels added</strong><span>${escapeHtml((draft.channels || []).join(', ') || 'None yet')}</span>
    <strong>Auto join</strong><span>${draft.autoJoin ? 'On' : 'Off'}</span>
    <strong>Stream preview</strong><span>${draft.streamPreview ? 'On' : 'Off'}</span>
    <strong>Layout</strong><span>${draft.layoutStyle === 'twitchStyle' ? 'Twitch Style' : 'Standard'}</span>
    <strong>Logs</strong><span>${draft.logs ? 'On' : 'Off'}</span>
    <strong>Starter tools</strong><span>${[draft.starterDiscord && '!discord', draft.starterLurk && '!lurk', draft.starterTimer && 'follow timer', draft.starterWave && 'wave popup'].filter(Boolean).join(', ') || 'None'}</span>
  </div>`;
}

async function moveOnboarding(direction) {
  if (direction > 0 && state.onboarding.step === 5) {
    await finishOnboarding();
    return;
  }
  if (state.onboarding.step === 1 && direction > 0) saveOnboardingConnection();
  if (state.onboarding.step === 3 && direction > 0) applyOnboardingLayout();
  state.onboarding.step = Math.min(5, Math.max(0, state.onboarding.step + direction));
  renderOnboarding();
}

function saveOnboardingConnection() {
  const draft = state.onboarding.draft;
  state.settings.profile.nick = draft.nick || state.settings.profile.nick;
  state.settings.profile.username = state.settings.profile.nick;
  state.settings.profile.realName = `${state.settings.profile.nick} via ClovaChat`;
  state.settings.profile.password = draft.password || state.settings.profile.password;
  state.settings.quickConnect.host = 'irc.chat.twitch.tv';
  state.settings.quickConnect.port = 6697;
  state.settings.quickConnect.tls = true;
  state.settings.quickConnect.channel = draft.channels?.[0] || state.settings.quickConnect.channel;
  draft.connectionStatus = `Saved connection for ${state.settings.profile.nick}.`;
  saveSettings();
}

function applyOnboardingLayout() {
  const draft = state.onboarding.draft;
  state.settings.appearance.twitchPlayer = Boolean(draft.streamPreview);
  state.settings.appearance.sevenTvEmotes = Boolean(draft.sevenTv);
  state.settings.appearance.layout = draft.layoutStyle === 'twitchStyle' ? 'twitchStyle' : 'standard';
  state.settings.preferences.moveLiveTabsToFront = Boolean(draft.moveLive);
  state.settings.preferences.chatDisplay.density = draft.compact ? 'compact' : 'comfortable';
  state.settings.preferences.chatDisplay.showTimestamps = Boolean(draft.timestamps);
  state.settings.preferences.chatDisplay.showBadges = Boolean(draft.badges);
  hydrateChatDisplaySettings();
  applyLayout(state.settings.appearance.layout);
}

async function finishOnboarding() {
  saveOnboardingConnection();
  applyOnboardingLayout();
  const draft = state.onboarding.draft;
  const channels = uniqueChannels(draft.channels || []);
  if (channels.length > 0) {
    state.settings.quickConnect.channel = channels[0];
    if (draft.autoJoin) state.settings.connection.autoJoinChannels = uniqueChannels([...state.settings.connection.autoJoinChannels, ...channels]);
  }
  addStarterTools(draft, channels[0] || state.settings.quickConnect.channel);
  state.settings.preferences.notifyOnMention = Boolean(draft.notifications);
  state.settings.preferences.channelLogging = Boolean(draft.logs && state.settings.preferences.channelLogFolder);
  state.settings.onboarding = { completed: true, skipped: false, completedAt: new Date().toISOString() };
  await saveSettings();
  hydrateSettings();
  renderAll();
  closeOnboarding();
}

function addStarterTools(draft, channel) {
  if (draft.starterDiscord && !findAlias('discord')) state.settings.aliases.push({ name: 'discord', type: 'mirc', output: 'Join the Discord: ' });
  if (draft.starterLurk && !findAlias('lurk')) state.settings.aliases.push({ name: 'lurk', type: 'mirc', output: 'I am lurking for a bit.' });
  if (draft.starterTimer && !state.settings.timedMessages.some((timer) => timer.message === 'Enjoying the stream? Don’t forget to follow!')) {
    state.settings.timedMessages.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      channel: normalizeChannel(channel),
      minutes: 10,
      seconds: 0,
      message: 'Enjoying the stream? Don’t forget to follow!',
      enabled: true,
      expiresAt: null,
      showOnChannel: true,
    });
  }
  if (draft.starterWave && !state.settings.popups.some((popup) => popup.label.toLowerCase() === 'wave')) {
    state.settings.popups.push({ label: 'Wave', command: '👋' });
  }
}

async function skipOnboarding() {
  state.settings.onboarding = { completed: false, skipped: true, completedAt: null };
  await saveSettings();
  closeOnboarding();
}

function closeOnboarding() {
  state.onboarding.open = false;
  el.onboardingBackdrop.hidden = true;
}

function openResetModal() {
  el.resetBackdrop.hidden = false;
  el.resetConfirmInput.value = '';
  el.resetConfirmButton.disabled = true;
  el.resetStatus.textContent = '';
}

function closeResetModal() {
  el.resetBackdrop.hidden = true;
}

async function resetClovaChat() {
  if (el.resetConfirmInput.value !== 'RESET') return;
  el.resetConfirmButton.disabled = true;
  el.resetStatus.textContent = 'Creating backup and resetting...';
  const result = await window.macIRC.resetSettings({
    deleteHistory: el.resetDeleteHistory.checked,
    deleteLogs: el.resetDeleteLogs.checked,
    deleteBackups: el.resetDeleteBackups.checked,
  });
  if (!result.ok) {
    el.resetStatus.textContent = `Reset failed: ${result.error}`;
    el.resetConfirmButton.disabled = false;
    return;
  }
  state.settings = result.settings;
  state.channels = [];
  state.messagesByTarget.clear();
  state.rosters.clear();
  ensureSettingsShape();
  hydrateSettings();
  renderAll();
  closeResetModal();
  appendStatus(`Reset complete. Backup saved to ${result.backupPath}`, 'success');
  openOnboarding();
}

function bindEvents() {
  window.addEventListener('beforeunload', saveCurrentStreamPlayerState);
  window.addEventListener('pointerdown', (event) => {
    if (state.activeContextMenu && !state.activeContextMenu.contains(event.target)) hideContextMenu();
  });
  window.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      openCommandPalette();
      return;
    }

    if (state.commandPalette.open) {
      handleCommandPaletteKeydown(event);
      return;
    }

    if (event.key === 'Escape') {
      hideContextMenu();
      if (state.channelSettings.open) closeChannelSettings();
      if (state.userDrawer.open) closeUserDrawer();
    }
  });
  window.addEventListener('blur', hideContextMenu);
  el.newMessagesButton.addEventListener('click', () => {
    state.pendingNewMessages = 0;
    renderNewMessagesButton();
    el.messages.scrollTop = el.messages.scrollHeight;
  });
  el.messages.addEventListener('scroll', () => {
    if (!chatIsAtBottom()) return;
    state.pendingNewMessages = 0;
    renderNewMessagesButton();
  });

  el.commandPaletteBackdrop.addEventListener('pointerdown', (event) => {
    if (event.target === el.commandPaletteBackdrop) closeCommandPalette();
  });
  el.commandPaletteInput.addEventListener('input', () => {
    state.commandPalette.query = el.commandPaletteInput.value;
    state.commandPalette.selectedIndex = 0;
    renderCommandPalette();
  });
  el.channelSettingsBackdrop.addEventListener('pointerdown', (event) => {
    if (event.target === el.channelSettingsBackdrop) closeChannelSettings();
  });
  el.channelSettingsClose.addEventListener('click', closeChannelSettings);
  el.channelSettingsResetButton.addEventListener('click', resetActiveChannelSettings);
  el.channelSettingsCopyButton.addEventListener('click', copyChannelSettingsFromSelection);
  el.channelSettingsApplyAllButton.addEventListener('click', applyActiveChannelSettingsToAll);
  el.onboardingSkipButton.addEventListener('click', skipOnboarding);
  el.onboardingBackButton.addEventListener('click', () => moveOnboarding(-1));
  el.onboardingNextButton.addEventListener('click', () => moveOnboarding(1));
  el.runOnboardingButton.addEventListener('click', () => openOnboarding({ rerun: true }));
  el.resetAppButton.addEventListener('click', openResetModal);
  el.resetCancelButton.addEventListener('click', closeResetModal);
  el.resetConfirmInput.addEventListener('input', () => {
    el.resetConfirmButton.disabled = el.resetConfirmInput.value !== 'RESET';
  });
  el.resetConfirmButton.addEventListener('click', resetClovaChat);

  bindChatDisplaySetting(el.showTimestampsToggle, 'showTimestamps', 'checked');
  bindChatDisplaySetting(el.showBadgesToggle, 'showBadges', 'checked');
  bindChatDisplaySetting(el.showEmotesToggle, 'showEmotes', 'checked');
  bindChatDisplaySetting(el.showSystemMessagesToggle, 'showSystemMessages', 'checked');
  bindChatDisplaySetting(el.highlightMentionsToggle, 'highlightMentions', 'checked');
  bindChatDisplaySetting(el.groupMessagesToggle, 'groupMessages', 'checked');
  bindChatDisplaySetting(el.hoverActionsToggle, 'hoverActions', 'checked');
  bindChatDisplaySetting(el.hoverModToolsToggle, 'hoverModTools', 'checked');
  bindChatDisplaySetting(el.reducedMotionToggle, 'reducedMotion', 'checked');
  bindChatDisplaySetting(el.chatDensitySelect, 'density', 'value');
  bindChatDisplaySetting(el.chatFontSizeInput, 'fontSize', 'number');

  el.userDrawerClose.addEventListener('click', closeUserDrawer);

  el.userDrawerMention.addEventListener('click', () => {
    const key = state.userDrawer.nick.toLowerCase();
    const current = el.messageInput.value;
    el.messageInput.value = `${current}${current && !current.endsWith(' ') ? ' ' : ''}@${key} `;
    el.messageInput.focus();
  });

  el.userDrawerCopy.addEventListener('click', async () => {
    const key = state.userDrawer.nick.toLowerCase();
    await navigator.clipboard.writeText(key);
    appendStatus(`Copied "${key}" to clipboard.`, 'info');
  });

  el.userDrawerTimeout.addEventListener('click', () => {
    const { channel, nick } = state.userDrawer;
    if (!canModerateChannel(channel)) return;
    if (!window.confirm(`Timeout ${nick} for 10 minutes in ${channel}?`)) return;
    runInputForTarget(`/timeout ${nick.toLowerCase()} 600`, channel);
  });

  el.userDrawerBan.addEventListener('click', () => {
    const { channel, nick } = state.userDrawer;
    if (!canModerateChannel(channel)) return;
    if (!window.confirm(`Ban ${nick} from ${channel}? This cannot be undone from here.`)) return;
    runInputForTarget(`/ban ${nick.toLowerCase()}`, channel);
  });

  el.userDrawerUnban.addEventListener('click', () => {
    const { channel, nick } = state.userDrawer;
    if (!canModerateChannel(channel)) return;
    if (!window.confirm(`Unban ${nick} in ${channel}?`)) return;
    runInputForTarget(`/unban ${nick.toLowerCase()}`, channel);
  });

  el.userDrawerClear.addEventListener('click', () => {
    const { channel, nick } = state.userDrawer;
    if (!window.confirm(`Remove ${nick}'s messages from your local view of ${channel}?`)) return;
    clearUserMessagesLocally(channel, nick);
  });

  let userNoteSaveTimer = null;
  el.userDrawerNote.addEventListener('input', () => {
    const key = state.userDrawer.nick.toLowerCase();
    state.settings.preferences.userNotes[key] = el.userDrawerNote.value;
    clearTimeout(userNoteSaveTimer);
    userNoteSaveTimer = setTimeout(() => saveSettings(), 500);
  });

  document.querySelectorAll('.tab').forEach((button) => {
    button.addEventListener('click', () => activateTab(button.dataset.tab));
  });
  el.dashboardSort.addEventListener('change', async () => {
    state.settings.preferences.dashboardSort = el.dashboardSort.value;
    await saveSettings();
    renderDashboard();
  });
  el.dashboardFilters.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-dashboard-filter]');
    if (!button) return;
    await setDashboardFilter(button.dataset.dashboardFilter);
  });

  el.connectButton.addEventListener('click', connect);
  el.disconnectButton.addEventListener('click', disconnect);
  el.disconnectedReconnectButton?.addEventListener('click', connect);
  el.disconnectedDismissButton?.addEventListener('click', hideDisconnectedOverlay);
  el.connectionToggleButton?.addEventListener('click', toggleConnection);
  el.joinChannelForm?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const channel = normalizeChannel(el.joinChannelInput.value);
    el.joinChannelInput.value = '';
    if (!channel) return;
    if (!state.connected) {
      appendStatus('Connect to the server before joining a channel.', 'error');
      return;
    }
    await joinChannelOnce(channel);
  });
  el.twitchPresetButton.addEventListener('click', applyTwitchPreset);
  el.twitchTokenButton.addEventListener('click', openTwitchTokenPage);
  el.darkModeToggle.addEventListener('change', async () => {
    state.settings.appearance.theme = el.darkModeToggle.checked ? 'dark' : 'light';
    applyTheme(state.settings.appearance.theme);
    await saveSettings();
  });
  el.layoutOptions.forEach((option) => {
    option.addEventListener('click', async () => {
      state.settings.appearance.layout = option.dataset.layout;
      applyLayout(state.settings.appearance.layout);
      await saveSettings();
    });
  });
  el.rosterToggleButton?.addEventListener('click', () => {
    setRosterDrawerOpen(!el.rosterPanel.classList.contains('is-open'));
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
  el.streamCatchUpButton?.addEventListener('click', catchUpStreamToLiveEdge);
  el.streamToolbar?.addEventListener('pointerdown', startStreamDrag);
  el.streamResizeGrip?.addEventListener('pointerdown', startStreamPanelResize);
  window.addEventListener('resize', clampStreamPanelToWindow);

  el.emoteButton?.addEventListener('click', (event) => {
    event.stopPropagation();
    setEmotePickerOpen(!state.emotePicker.open);
  });
  el.emotePickerTabs.forEach((tab) => {
    tab.addEventListener('click', () => setEmotePickerSource(tab.dataset.emoteSource));
  });
  el.emotePickerSearch?.addEventListener('input', () => {
    state.emotePicker.search = el.emotePickerSearch.value;
    renderEmotePickerGrid();
  });
  el.emotePicker?.addEventListener('click', (event) => event.stopPropagation());
  document.addEventListener('click', () => {
    if (state.emotePicker.open) setEmotePickerOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.emotePicker.open) setEmotePickerOpen(false);
    if (event.key === 'Escape' && state.mentionsPanel.open) setMentionsPanelOpen(false);
  });

  el.mentionsButton?.addEventListener('click', () => setMentionsPanelOpen(true));
  el.mentionsModal?.addEventListener('click', (event) => event.stopPropagation());
  el.mentionsBackdrop?.addEventListener('click', () => setMentionsPanelOpen(false));
  el.mentionsModalClose?.addEventListener('click', () => setMentionsPanelOpen(false));
  el.mentionsClearButton?.addEventListener('click', clearMentions);

  el.autoJoinForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const channel = normalizeChannel(el.autoJoinChannel.value);
    if (!channel || isServerTarget(channel)) return;
    setChannelSetting(channel, 'autoJoin', true);
    state.settings.connection.autoJoinChannels = uniqueChannels([
      ...state.settings.connection.autoJoinChannels,
      channel,
    ]);
    el.autoJoinChannel.value = '';
    await saveSettings();
    renderAutoJoinChannels();
    renderChatActions();
    renderDashboard();
    if (state.connected) window.macIRC.send({ target: channel, text: `/join ${channel}` });
  });

  el.addAutoJoinCurrentButton.addEventListener('click', async () => {
    const channel = normalizeChannel(state.activeChannel);
    if (!channel || isServerTarget(channel) || channelIsAutoJoined(channel)) return;
    setChannelSetting(channel, 'autoJoin', true);
    state.settings.connection.autoJoinChannels = uniqueChannels([
      ...state.settings.connection.autoJoinChannels,
      channel,
    ]);
    await saveSettings();
    renderAutoJoinChannels();
    renderChatActions();
    renderDashboard();
  });

  el.inputForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = el.messageInput.value;
    el.messageInput.value = '';
    hideNickSuggestion();
    rememberSentInput(input);
    runInput(input);
  });

  el.messageInput.addEventListener('input', updateNickSuggestion);
  el.messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Tab' && state.nickSuggestion) {
      event.preventDefault();
      applyNickSuggestion();
    }

    if (event.key === 'Escape') hideNickSuggestion();

    if (event.key === 'ArrowUp' && !el.messageInput.value) {
      recallSentInput(event, -1);
    }

    if (event.key === 'ArrowDown' && state.sentMessageIndex >= 0) {
      recallSentInput(event, 1);
    }
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
  hideDisconnectedOverlay();
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
  state.userInitiatedDisconnect = true;
  await window.macIRC.disconnect();
}

async function toggleConnection() {
  if (state.connectionToggleBusy) return;
  state.connectionToggleBusy = true;
  const button = el.connectionToggleButton;
  const goingOffline = state.connected;
  if (button) {
    button.disabled = true;
    button.textContent = goingOffline ? 'Disconnecting...' : 'Connecting...';
  }
  try {
    if (goingOffline) await disconnect();
    else await connect();
  } finally {
    state.connectionToggleBusy = false;
    renderConnectionCard();
  }
}

function showDisconnectedOverlay() {
  if (!el.disconnectedBackdrop) return;
  el.disconnectedMessage.textContent = state.settings.profile.nick
    ? `The connection to ${state.settings.quickConnect.host} was lost.`
    : 'The connection to the server was lost.';
  el.disconnectedBackdrop.hidden = false;
}

function hideDisconnectedOverlay() {
  if (!el.disconnectedBackdrop) return;
  el.disconnectedBackdrop.hidden = true;
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

  if (el.connectionToggleButton && !state.connectionToggleBusy) {
    el.connectionToggleButton.disabled = false;
    if (state.connected) {
      el.connectionToggleButton.textContent = 'Disconnect';
      el.connectionToggleButton.classList.add('danger');
      el.connectionToggleButton.classList.remove('primary');
    } else {
      el.connectionToggleButton.textContent = 'Connect';
      el.connectionToggleButton.classList.add('primary');
      el.connectionToggleButton.classList.remove('danger');
    }
  }
}

function applyTheme(theme) {
  document.body.dataset.theme = theme === 'dark' ? 'dark' : 'light';
}

function applyLayout(layout) {
  const isTwitchStyle = layout === 'twitchStyle';
  document.body.dataset.layout = isTwitchStyle ? 'twitch' : 'standard';
  el.layoutOptions.forEach((option) => {
    option.classList.toggle('is-active', option.dataset.layout === (isTwitchStyle ? 'twitchStyle' : 'standard'));
  });
  if (!isTwitchStyle) setRosterDrawerOpen(false);
  renderStreamPlayer();
}

function setRosterDrawerOpen(open) {
  el.rosterPanel.classList.toggle('is-open', open);
  el.rosterToggleButton.title = open ? 'Hide users' : 'Show users';
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
    renderChatActions();
  }

  if (event.type === 'disconnected') {
    state.connected = false;
    state.channels = [];
    state.activeChannel = normalizeChannel(el.channel.value);
    state.rosters.clear();
    state.messagesByTarget.clear();
    state.recentChatters = [];
    state.userStats.clear();
    closeUserDrawer();
    clearTimerHandles();
    stopLivePolling();
    clearStreamPlayer();
    state.streamDetails.clear();
    el.connectionState.textContent = 'Offline';
    el.connectionStatus.classList.remove('connected');
    el.connectionStatus.classList.add('disconnected');
    appendStatus(event.text || 'Disconnected.');
    renderChannels();
    renderMessages();
    renderRoster();
    renderStreamPlayer();
    renderDashboard();
    renderChatActions();
    hideNickSuggestion();
    if (!state.userInitiatedDisconnect) showDisconnectedOverlay();
    state.userInitiatedDisconnect = false;
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
    loadTwitchChannelEmotes(event.channel, event.roomId);
  }

  if (event.type === 'userstate') {
    addChannel(event.channel);
    addRosterUser(event.channel, event.nick, event.role, { roleKnown: event.roleKnown, badges: event.badges });
  }

  if (event.type === 'notice') {
    appendStatus(event.channel && event.channel.startsWith('#') ? `[${event.channel}] ${event.text}` : event.text, 'info');
  }

  if (event.type === 'message') {
    addChannel(event.target);
    addRosterUser(event.target, event.nick, event.role, { roleKnown: event.roleKnown, badges: event.badges });
    rememberChatter(event.nick);
    markChannelUnread(event.target);
    appendMessage(event);
    recordUserMessage(event.target, event.nick, event.text, event.timestamp);
    runBotRules(event);
    notifyOnMention(event);
  }

  if (event.type === 'action') {
    addChannel(event.target);
    addRosterUser(event.target, event.nick, event.role, { roleKnown: event.roleKnown, badges: event.badges });
    rememberChatter(event.nick);
    markChannelUnread(event.target);
    recordUserMessage(event.target, event.nick, `* ${event.text}`, event.timestamp);
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
    const override = channelCommandOverride(target, commandName);
    if (override || alias) {
      if (!channelSettingValue(target, 'commandsEnabled', true)) {
        appendStatus(`Commands are disabled for ${normalizeChannel(target)}.`, 'error');
        return;
      }
      if (override) {
        runScript(expandCommandTemplate(override, args.join(' '), target), target, depth + 1);
        return;
      }
      if (!channelSettingValue(target, 'commands.allowGlobal', true)) {
        appendStatus(`Global commands are disabled for ${normalizeChannel(target)}.`, 'error');
        return;
      }
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

function channelCommandOverride(target, commandName) {
  const name = normalizeCommandName(commandName);
  const overrides = parseCommandMap(channelSettingValue(target, 'commands.overrides', ''));
  const channelOnly = parseCommandMap(channelSettingValue(target, 'commands.channelOnly', ''));
  return overrides.get(name) || channelOnly.get(name) || '';
}

function parseCommandMap(value) {
  const map = new Map();
  String(value || '').split(/\r?\n/).forEach((line) => {
    const [name, ...outputParts] = line.split('=');
    const key = normalizeCommandName(name);
    const output = outputParts.join('=').trim();
    if (key && output) map.set(key, output);
  });
  return map;
}

function expandCommandTemplate(output, argText, channel) {
  const args = argText ? argText.split(' ') : [];
  return String(output || '')
    .replaceAll('$channel', channel || '')
    .replaceAll('$nick', state.settings.profile.nick || '')
    .replaceAll('$*', argText || '')
    .replace(/\$(\d+)/g, (_match, index) => args[Number(index) - 1] || '');
}

function expandAliasOutput(alias, argText, channel) {
  return expandCommandTemplate(alias.output, argText, channel);
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
  if (!channelSettingValue(event.target, 'botEnabled', true) || !channelSettingValue(event.target, 'autoRepliesEnabled', true)) return;
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
  renderDashboard();
  renderChannelSettingsList();
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
  renderMentionsButton();
  renderChangelog();
  scheduleAllTimers();

  if (state.settings.connection.connectOnOpen && !state.autoConnectStarted) {
    state.autoConnectStarted = true;
    connect();
  }
}

const CHANGELOG = [
  {
    version: 'v1.2.40',
    date: '2026-06-28',
    title: 'Sidebar Overhaul: Connect Button, Join Channel, Taller List',
    bullets: [
      'Fixed a real bug where Disconnect didn\'t reliably update the UI — a stale-connection guard added for the auto-reconnect watchdog was also swallowing the close event from a manual disconnect.',
      'Added a single state-driven Connect/Disconnect button directly on the connection card, with a loading state while connecting or disconnecting.',
      'Added an "Enter channel name..." field with a Join button above the channel list, so you can join a channel without typing /join.',
      'The channel list now grows to fill the sidebar\'s available height instead of stopping at a fixed short height.',
      'Enlarged the ClovaChat logo in the top nav bar.',
    ],
  },
  {
    version: 'v1.2.39',
    date: '2026-06-28',
    title: 'Stream Card & Empty States',
    bullets: [
      'In Twitch Style layout, the stream header, video, and action row are now one cohesive card that sizes to its own content instead of stretching to fill the column — removing the dead space that used to sit above the video.',
      'The stream card now shows a friendly empty state ("No stream selected") instead of just disappearing when no stream is active.',
      'Added a "No channel selected" empty state with guidance, and changed the no-messages state to "No messages yet — say hello to start the chat."',
      'Made the stream toolbar buttons (Prev/Next/Play/Mute/Catch Up/Hide) taller and more consistent.',
    ],
  },
  {
    version: 'v1.2.38',
    date: '2026-06-28',
    title: 'Chat Header & Composer Polish',
    bullets: [
      'Removed the awkward horizontal scrollbar on the chat header pills (Live/Users/Messages/Connection/etc.) — they now wrap to a new line instead of scrolling.',
      'The message box now shows "Message #channel..." for the active channel, and disables itself with a clear placeholder when disconnected or no channel is selected, instead of silently failing to send.',
    ],
  },
  {
    version: 'v1.2.37',
    date: '2026-06-28',
    title: 'Fix Missing Top Nav Tabs',
    bullets: [
      'Fixed a CSS rule conflict that squeezed the top navigation into a clipped 2-column grid, hiding Bot, Commands, Popups, Timers, Raw, Docs, What\'s New, and Settings — only Dashboard and Chat were visible.',
    ],
  },
  {
    version: 'v1.2.36',
    date: '2026-06-28',
    title: 'Top Navigation Polish',
    bullets: [
      'Restyled the new top navigation bar: taller, cleaner tab links with an underline-style active state instead of boxy mismatched buttons, and a clearer divider next to the logo.',
    ],
  },
  {
    version: 'v1.2.35',
    date: '2026-06-28',
    title: 'Navigation Layout Swap',
    bullets: [
      'Moved the Dashboard/Chat/Bot/Commands/Popups/Timers/Raw/Docs/What\'s New/Settings workspace buttons to a new bar across the top of the window.',
      'Moved the channel list out of the top of Chat into the left sidebar, so it\'s visible alongside the connection card and stream controls.',
      'This applies to both the Standard and Twitch Style layouts.',
    ],
  },
  {
    version: 'v1.2.34',
    date: '2026-06-27',
    title: 'Disconnect Popup',
    bullets: [
      'When the server connection is lost unexpectedly, ClovaChat now shows a popup offering to reconnect immediately, instead of leaving you to notice and hunt for the Connect button.',
      'Disconnecting on purpose (via the Disconnect button) doesn\'t trigger the popup.',
    ],
  },
  {
    version: 'v1.2.33',
    date: '2026-06-27',
    title: 'Stream Latency Display & Catch Up',
    bullets: [
      'The stream toolbar now shows an estimated delay behind the broadcaster (e.g. "4.2s behind"), highlighted when it gets unusually high.',
      'Added a Catch Up button that nudges the player closer to the live edge to cut down delay, since Twitch\'s embed doesn\'t expose a direct seek-to-live control.',
    ],
  },
  {
    version: 'v1.2.32',
    date: '2026-06-27',
    title: 'Bigger Mentions Button',
    bullets: [
      'Moved the Mentions button to sit under the popup action row, and made it bigger and labeled instead of a small floating icon.',
    ],
  },
  {
    version: 'v1.2.31',
    date: '2026-06-27',
    title: 'Mentions in a Modal',
    bullets: [
      'The @ button now opens a centered popup/modal listing all your mentions instead of a small anchored dropdown, with a clear close button and a Clear all action.',
    ],
  },
  {
    version: 'v1.2.30',
    date: '2026-06-27',
    title: 'Mention Badges & Mentions Panel',
    bullets: [
      'Channel tabs now show a small @ badge when you\'re mentioned in a channel you\'re not currently viewing.',
      'Added an @ button above the channel tabs that lists every recent mention across all channels — click one to jump straight to that channel and message.',
    ],
  },
  {
    version: 'v1.2.29',
    date: '2026-06-27',
    title: 'Stream Player Follows the Active Channel',
    bullets: [
      'Switching channel tabs now switches the stream player to that channel automatically, instead of leaving it stuck on whichever streamer was last selected.',
      'Since there\'s only ever one active video, leaving a tab effectively stops that streamer\'s video instead of leaving it playing in the background.',
    ],
  },
  {
    version: 'v1.2.28',
    date: '2026-06-27',
    title: 'Twitch Style Sizing Fix & Sidebar Cleanup',
    bullets: [
      'Fixed the stream and chat panels collapsing to a tiny box on channels with little or no chat instead of filling the available height — a leftover grid row definition from before the layout refactor was misplacing them.',
      'Removed the vertical channel list from the sidebar in Twitch Style since the top channel tabs already cover that.',
    ],
  },
  {
    version: 'v1.2.27',
    date: '2026-06-27',
    title: 'Uniform Channel Tab Sizing',
    bullets: [
      'In Twitch Style layout, channel tabs are now a fixed equal width regardless of channel name length or activity, instead of resizing to fit content.',
    ],
  },
  {
    version: 'v1.2.26',
    date: '2026-06-27',
    title: 'Twitch Style Layout Refactor',
    bullets: [
      'Rebuilt Twitch Style into a real 3-column layout: a condensed sidebar with a vertical channel list, a flexible stream area in the middle with a live/title/category/viewers header, and a fixed-width chat panel on the right.',
      'Chat rows now flow like real Twitch chat (time, colored username, message inline on one line) instead of boxy multi-column rows.',
      'Slimmer channel tabs, a sticky chat header, and a stream action bar (Wave/Say hello/Leave channel) positioned under the video.',
      'The sidebar collapses to icons only on narrow windows, and the stream area shrinks while staying 16:9.',
    ],
  },
  {
    version: 'v1.2.25',
    date: '2026-06-27',
    title: 'Sidebar & Chat Proportions',
    bullets: [
      'Condensed the sidebar (was 336px, now 290px) and tightened workspace button sizing so everything fits more comfortably.',
      'Capped the docked stream player\'s height so it can no longer balloon and crowd out the rest of the sidebar.',
      'Tightened the chat message columns (timestamp and username) to give message text more room across all layouts.',
    ],
  },
  {
    version: 'v1.2.24',
    date: '2026-06-27',
    title: 'Twitch Style Layout Polish',
    bullets: [
      'In Twitch Style layout, the chat column is now noticeably wider relative to the stream so message text isn\'t squeezed into a narrow strip.',
      'The left sidebar is now thinner in Twitch Style layout, freeing up more room for the stream and chat.',
    ],
  },
  {
    version: 'v1.2.23',
    date: '2026-06-27',
    title: 'Layout Choice in Onboarding',
    bullets: [
      'The onboarding wizard\'s Choose Your Chat Layout step now shows Standard vs Twitch Style as visual frames you pick between, matching the new Layouts setting (placeholder frames for now, real preview images may follow).',
    ],
  },
  {
    version: 'v1.2.22',
    date: '2026-06-27',
    title: 'Layouts: Standard & Twitch Style',
    bullets: [
      'Added a Layouts section in Settings with two options: Standard (the existing layout) and Twitch Style, which puts the stream in the middle, chat on the right, and tucks the user list behind a toggle icon.',
    ],
  },
  {
    version: 'v1.2.21',
    date: '2026-06-27',
    title: 'Emote Picker Ordering',
    bullets: [
      'The emote picker now sorts groups with the active channel first, other joined channels next, and the Twitch Global section last.',
    ],
  },
  {
    version: 'v1.2.20',
    date: '2026-06-27',
    title: 'Emote Picker Grouped by Streamer',
    bullets: [
      'The emote picker now groups emotes by streamer instead of one flat list, covering every channel you have joined, not just the active one.',
      'The Twitch tab also breaks out a separate Global section for emotes available everywhere.',
    ],
  },
  {
    version: 'v1.2.19',
    date: '2026-06-27',
    title: 'Emote Picker Fix',
    bullets: [
      'Fixed Twitch emotes not rendering in the emote picker (they showed broken image icons) while 7TV emotes worked fine, caused by a function name collision that mangled the image URLs.',
    ],
  },
  {
    version: 'v1.2.18',
    date: '2026-06-27',
    title: 'Emote Picker',
    bullets: [
      'Added an emote button next to the message box that opens a searchable picker for Twitch (global + channel) and 7TV emotes for the active channel.',
      'Clicking an emote inserts it into your message at the cursor.',
    ],
  },
  {
    version: 'v1.2.17',
    date: '2026-06-27',
    title: 'Dockable Stream Player & Stale Connection Fix',
    bullets: [
      'The stream player now lives in the sidebar by default again, but can be dragged out by its toolbar into a floating panel anywhere in the window, and dropped back near the sidebar to re-dock.',
      'Fixed chat appearing to freeze (connection still shows Connected, but no new messages from others arrive) by detecting a stale/dead connection and automatically reconnecting and rejoining channels.',
    ],
  },
  {
    version: 'v1.2.16',
    date: '2026-06-27',
    title: 'Floating Stream Player & Ad-Freeze Fix',
    bullets: [
      'The stream preview is now a floating panel you can drag anywhere (including on top of chat) and resize from its corner, instead of being fixed in the sidebar. Its position and size are remembered.',
      'Fixed a bug where the stream would get stuck after a Twitch ad break and only resume after restarting the app — the player now detects a stuck state and automatically resumes.',
    ],
  },
  {
    version: 'v1.2.15',
    date: '2026-06-27',
    title: 'Visual Polish Pass',
    bullets: [
      'Refined spacing, typography, and card styling across the sidebar, chat view, dashboard, and stream panel for a cleaner, more consistent look.',
      'Clearer button hierarchy (primary/secondary/tertiary/danger) with more consistent sizing and hover states throughout the app.',
      'Polished channel tabs, the channel status strip, dashboard filters/cards/stats, the user list, and the chat composer.',
    ],
  },
  {
    version: 'v1.2.14',
    date: '2026-06-27',
    title: "What's New Page & Chat Layout Fix",
    bullets: [
      'New "What\'s New" navigation tab and command palette entry showing every release and what changed in it.',
      'Fixed a chat layout bug where the hover action toolbar on messages (Mention/Copy/Profile/Timeout/Ban) reserved space even while hidden, squeezing message text into a one-word-per-line wrap on narrower windows.',
    ],
  },
  {
    version: 'v1.2.13',
    date: '2026-06-27',
    title: 'Onboarding Wizard, Chat UI Overhaul & Reset to First Install',
    bullets: [
      'First-launch onboarding wizard: connect Twitch, add channels, choose a layout, and add starter tools.',
      'New Chat Display settings — timestamps, badges, emotes, density, font size, grouped messages, reduced motion.',
      'Slash-command autocomplete, sent-message history (Up/Down), hover actions on messages, and a "New Messages" button when scrolled up.',
      'Settings → Danger Zone: Reset to First Install with typed confirmation and an automatic backup first.',
    ],
  },
  {
    version: 'v1.2.12',
    date: '2026-06-27',
    title: 'Per-Channel Settings',
    bullets: [
      'Override chat display, bot, commands, timers, popups, logs, notifications, and stream preview on a per-channel basis.',
      'Copy settings from another channel, apply settings to all channels, or reset any override back to the global default.',
    ],
  },
  {
    version: 'v1.2.11',
    date: '2026-06-27',
    title: 'Multi-Channel Dashboard',
    bullets: [
      'One view of every joined/auto-join channel: live status, viewers, category, chat activity, bot/timer/log status.',
      'Sort by live-first, most active, alphabetical, recently active, or most viewers; filter by live, offline, auto-join, or bot-enabled.',
    ],
  },
  {
    version: 'v1.2.10',
    date: '2026-06-27',
    title: 'Command Palette',
    bullets: [
      'Cmd+K (macOS) / Ctrl+K (Windows/Linux) opens a searchable palette for channels, users, settings, timers, popups, bot rules, commands, stream controls, and navigation.',
      'Keyboard-driven (arrows to move, Enter to run, Escape to close), shows recent actions first, and confirms before anything destructive.',
    ],
  },
  {
    version: 'v1.2.6 – v1.2.9',
    date: '2026-06-26 – 2026-06-27',
    title: 'Sidebar Redesign & Chat Power Tools',
    bullets: [
      'Sidebar reorganized into cards: connection summary, stream preview, workspace navigation, Auto Join, Server Connection.',
      'Channel status strip above the message list showing user/message counts and bot/log status.',
      'Subtle idle state ("Waiting for messages in #channel") for quiet channels.',
      'User profile drawer when clicking a username — session stats, recent messages, a local note, and moderation quick actions.',
    ],
  },
  {
    version: 'v1.2.3 – v1.2.5',
    date: '2026-06-26',
    title: 'Timer Upgrades',
    bullets: [
      'Optional auto-expiration for timers (days/hours/minutes) with an inline editor to add, change, or clear it later.',
      'On-channel timer pills with a live countdown, pause/resume, delete, and click-to-send-now.',
      'Fixed timer scheduling so toggling one timer no longer reset every other timer’s countdown.',
    ],
  },
  {
    version: 'v1.2.0',
    date: '2026-06-26',
    title: 'Sidebar Visual Refresh',
    bullets: [
      'First pass at the card-based sidebar look, with icons on the workspace tabs and clearer primary/danger button styling.',
    ],
  },
  {
    version: 'v1.0.0 – v1.1.9, v1.2.1',
    date: '2026-06-26',
    title: 'Auto-Updates & Release Reliability',
    bullets: [
      'In-app updater that checks GitHub Releases and installs the right asset for Windows or macOS.',
      'macOS builds are now signed and notarized by Apple, so updates install with no Gatekeeper warnings.',
      'Fixed a download race condition that could corrupt the installer mid-update.',
      'Windows installer now closes ClovaChat automatically once it launches.',
      'Several smaller patch releases along the way while tracking down the above — not all individually listed here.',
    ],
  },
];

function renderChangelog() {
  if (!el.whatsnewList) return;
  el.whatsnewList.innerHTML = '';
  CHANGELOG.forEach((entry) => {
    const card = document.createElement('section');
    card.className = 'settings-group whatsnew-entry';

    const header = document.createElement('div');
    header.className = 'whatsnew-entry-header';
    const version = document.createElement('span');
    version.className = 'whatsnew-version';
    version.textContent = entry.version;
    const date = document.createElement('span');
    date.className = 'whatsnew-date';
    date.textContent = entry.date;
    header.append(version, date);

    const title = document.createElement('h3');
    title.className = 'whatsnew-title';
    title.textContent = entry.title;

    const list = document.createElement('ul');
    list.className = 'whatsnew-bullets';
    entry.bullets.forEach((bullet) => {
      const item = document.createElement('li');
      item.textContent = bullet;
      list.append(item);
    });

    card.append(header, title, list);
    el.whatsnewList.append(card);
  });
}

function openChannelSettings(channel = state.activeChannel) {
  const normalized = normalizeChannel(channel);
  if (!normalized || isServerTarget(normalized)) return;
  state.channelSettings = { open: true, channel: normalized };
  el.channelSettingsBackdrop.hidden = false;
  renderChannelSettingsModal();
}

function closeChannelSettings() {
  state.channelSettings.open = false;
  el.channelSettingsBackdrop.hidden = true;
}

function renderChannelSettingsModal() {
  const channel = normalizeChannel(state.channelSettings.channel);
  if (!channel) return;
  const key = channelKey(channel);
  const overrides = countChannelSettingOverrides(state.settings.channels[key]);
  el.channelSettingsTitle.textContent = `Channel Settings: ${channel}`;
  el.channelSettingsSummary.textContent = overrides > 0
    ? `${overrides} setting override${overrides === 1 ? '' : 's'} saved for this channel.`
    : 'Every setting is using the global default.';
  renderChannelSettingsCopyOptions(channel);
  el.channelSettingsSections.innerHTML = '';
  CHANNEL_SETTING_SECTIONS.forEach((section, index) => {
    const details = document.createElement('details');
    details.className = 'channel-settings-section';
    details.open = index < 2;
    const summary = document.createElement('summary');
    summary.textContent = section.title;
    details.append(summary);
    section.fields.forEach((field) => details.append(renderChannelSettingField(channel, field)));
    if (section.title === 'Logs') details.append(renderChannelLogActions(channel));
    el.channelSettingsSections.append(details);
  });
}

function renderChannelLogActions(channel) {
  const row = document.createElement('div');
  row.className = 'channel-setting-row channel-log-actions';
  const label = document.createElement('div');
  label.innerHTML = '<strong>Channel log actions</strong><span>Open the logs folder or clear this channel from the local chat view.</span>';
  const actions = document.createElement('div');
  actions.className = 'channel-setting-meta';
  const open = document.createElement('button');
  open.type = 'button';
  open.textContent = 'Open Logs Folder';
  open.disabled = !state.settings.preferences.channelLogFolder;
  open.addEventListener('click', openConfiguredLogFolder);
  const clear = document.createElement('button');
  clear.type = 'button';
  clear.className = 'danger';
  clear.textContent = 'Clear Local Channel Chat';
  clear.addEventListener('click', () => {
    if (!window.confirm(`Clear local chat history for ${channel}?`)) return;
    state.messagesByTarget.set(channel, []);
    scheduleHistorySave();
    renderMessages();
    renderDashboard();
  });
  actions.append(open, clear);
  row.append(label, actions);
  return row;
}

function renderChannelSettingField(channel, field) {
  const row = document.createElement('div');
  const showTimestamps = channelSettingValue(event.target || state.activeChannel, 'chat.showTimestamps', true);
  row.className = 'channel-setting-row';
  const label = document.createElement('label');
  label.textContent = field.label;
  const control = createChannelSettingControl(channel, field);
  label.append(control);
  const meta = document.createElement('div');
  meta.className = 'channel-setting-meta';
  const source = document.createElement('span');
  source.textContent = channelSettingHasOverride(channel, field.path) ? 'Using: Channel Override' : 'Using: Global Default';
  const reset = document.createElement('button');
  reset.type = 'button';
  reset.textContent = 'Reset to Global Default';
  reset.disabled = !channelSettingHasOverride(channel, field.path);
  reset.addEventListener('click', async () => {
    deleteChannelSetting(channel, field.path);
    await saveSettings();
    applyChannelSettingsSideEffects(channel);
    renderChannelSettingsModal();
  });
  meta.append(source, reset);
  row.append(label, meta);
  return row;
}

function createChannelSettingControl(channel, field) {
  let control;
  const value = channelSettingValue(channel, field.path, field.defaultValue);
  if (field.type === 'textarea') {
    control = document.createElement('textarea');
    control.value = value || '';
  } else if (field.type === 'boolean') {
    control = document.createElement('input');
    control.type = 'checkbox';
    control.checked = Boolean(value);
  } else {
    control = document.createElement('input');
    control.type = field.type === 'number' ? 'number' : 'text';
    control.value = value ?? '';
    if (field.min !== undefined) control.min = String(field.min);
    if (field.max !== undefined) control.max = String(field.max);
    if (field.step !== undefined) control.step = String(field.step);
  }
  if (field.placeholder) control.placeholder = field.placeholder;
  control.addEventListener('change', () => updateChannelSettingFromControl(channel, field, control));
  return control;
}

async function updateChannelSettingFromControl(channel, field, control) {
  const value = field.type === 'boolean'
    ? control.checked
    : (field.type === 'number' ? Number(control.value || field.defaultValue || 0) : control.value);
  setChannelSetting(channel, field.path, value);
  if (field.path === 'autoJoin') syncAutoJoinFromChannelSetting(channel, value);
  await saveSettings();
  applyChannelSettingsSideEffects(channel);
  renderChannelSettingsModal();
}

function renderChannelSettingsCopyOptions(channel) {
  el.channelSettingsCopySource.innerHTML = '';
  dashboardChannelNames().filter((entry) => entry !== channel).forEach((entry) => {
    const option = document.createElement('option');
    option.value = entry;
    option.textContent = channelDisplayName(entry);
    el.channelSettingsCopySource.append(option);
  });
  el.channelSettingsCopyButton.disabled = el.channelSettingsCopySource.options.length === 0;
}

async function resetActiveChannelSettings() {
  const channel = state.channelSettings.channel;
  if (!channel || !window.confirm(`Reset all channel settings for ${channel} to global defaults?`)) return;
  delete state.settings.channels[channelKey(channel)];
  await saveSettings();
  applyChannelSettingsSideEffects(channel);
  renderChannelSettingsModal();
}

async function copyChannelSettingsFromSelection() {
  const source = el.channelSettingsCopySource.value;
  const target = state.channelSettings.channel;
  if (!source || !target) return;
  state.settings.channels[channelKey(target)] = structuredClone(state.settings.channels[channelKey(source)] || {});
  await saveSettings();
  applyChannelSettingsSideEffects(target);
  renderChannelSettingsModal();
}

async function applyActiveChannelSettingsToAll() {
  const source = state.channelSettings.channel;
  if (!source || !window.confirm(`Apply ${source}'s channel settings to every joined and Auto Join channel?`)) return;
  const snapshot = structuredClone(state.settings.channels[channelKey(source)] || {});
  dashboardChannelNames().forEach((channel) => {
    state.settings.channels[channelKey(channel)] = structuredClone(snapshot);
    syncAutoJoinFromChannelSetting(channel, channelSettingValue(channel, 'autoJoin', false));
  });
  await saveSettings();
  renderAll();
  renderChannelSettingsModal();
}

function renderChannelSettingsList() {
  if (!el.channelSettingsList || !state.settings) return;
  el.channelSettingsList.innerHTML = '';
  const channels = dashboardChannelNames();
  if (channels.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'settings-hint';
    empty.textContent = 'Join or save a channel to edit channel-specific settings.';
    el.channelSettingsList.append(empty);
    return;
  }
  channels.forEach((channel) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = channelDisplayName(channel);
    button.addEventListener('click', () => openChannelSettings(channel));
    el.channelSettingsList.append(button);
  });
}

function applyChannelSettingsSideEffects(channel) {
  renderMessages();
  renderPopups();
  renderChannels();
  renderDashboard();
  renderChannelSettingsList();
  scheduleAllTimers();
}

async function setDashboardFilter(filter, { save = true } = {}) {
  const nextFilter = ['all', 'live', 'offline', 'active', 'autoJoin', 'bot'].includes(filter) ? filter : 'all';
  state.settings.preferences.dashboardFilter = nextFilter;
  el.dashboardFilters.querySelectorAll('[data-dashboard-filter]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.dashboardFilter === nextFilter);
  });
  if (save) await saveSettings();
  renderDashboard();
}

function renderDashboard() {
  if (!el.dashboardGrid || !state.settings) return;
  const cards = dashboardChannelCards();
  el.dashboardGrid.innerHTML = '';

  if (cards.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'dashboard-empty';
    empty.innerHTML = '<strong>No joined channels yet.</strong><span>Join a Twitch channel to start monitoring chat, stream status, timers, and bot tools.</span>';
    el.dashboardGrid.append(empty);
    return;
  }

  cards.forEach((card) => {
    el.dashboardGrid.append(renderDashboardCard(card));
  });
}

function dashboardChannelCards() {
  const channels = dashboardChannelNames();
  const cards = channels.map(dashboardChannelCard);
  const filtered = filterDashboardCards(cards, state.settings.preferences.dashboardFilter || 'all');
  return sortDashboardCards(filtered, state.settings.preferences.dashboardSort || 'live');
}

function dashboardChannelNames() {
  return uniqueChannels([
    ...state.channels,
    ...state.settings.connection.autoJoinChannels,
    ...Object.keys(state.settings.channels || {}).map((key) => `#${key}`),
  ]).filter((channel) => !isServerTarget(channel));
}

function channelKey(channel) {
  return normalizeChannel(channel).replace(/^#/, '').toLowerCase();
}

function channelSettings(channel) {
  return state.settings.channels?.[channelKey(channel)] || {};
}

function channelSettingValue(channel, path, defaultValue = '') {
  const value = getNestedValue(channelSettings(channel), path);
  return value === undefined ? defaultValue : value;
}

function channelSettingHasOverride(channel, path) {
  return getNestedValue(channelSettings(channel), path) !== undefined;
}

function setChannelSetting(channel, path, value) {
  const key = channelKey(channel);
  state.settings.channels[key] ||= {};
  setNestedValue(state.settings.channels[key], path, value);
}

function deleteChannelSetting(channel, path) {
  const settings = state.settings.channels[channelKey(channel)];
  if (!settings) return;
  deleteNestedValue(settings, path);
}

function getNestedValue(object, path) {
  return path.split('.').reduce((current, part) => current?.[part], object);
}

function setNestedValue(object, path, value) {
  const parts = path.split('.');
  const last = parts.pop();
  const target = parts.reduce((current, part) => {
    current[part] ||= {};
    return current[part];
  }, object);
  target[last] = value;
}

function deleteNestedValue(object, path) {
  const parts = path.split('.');
  const last = parts.pop();
  const stack = [];
  let current = object;
  for (const part of parts) {
    if (!current?.[part]) return;
    stack.push([current, part]);
    current = current[part];
  }
  delete current[last];
  while (stack.length > 0) {
    const [parent, key] = stack.pop();
    if (Object.keys(parent[key] || {}).length === 0) delete parent[key];
  }
}

function countChannelSettingOverrides(value) {
  if (!value || typeof value !== 'object') return 0;
  return Object.values(value).reduce((count, entry) => (
    count + (entry && typeof entry === 'object' && !Array.isArray(entry) ? countChannelSettingOverrides(entry) : 1)
  ), 0);
}

function syncAutoJoinFromChannelSetting(channel, enabled) {
  const normalized = normalizeChannel(channel);
  if (!normalized) return;
  if (enabled) {
    state.settings.connection.autoJoinChannels = uniqueChannels([...state.settings.connection.autoJoinChannels, normalized]);
  } else {
    state.settings.connection.autoJoinChannels = state.settings.connection.autoJoinChannels
      .filter((entry) => normalizeChannel(entry) !== normalized);
  }
}

function channelDisplayName(channel) {
  const alias = channelSettingValue(channel, 'displayName', '');
  return alias ? `${alias} (${normalizeChannel(channel)})` : normalizeChannel(channel);
}

function dashboardChannelCard(channel) {
  const login = channel.replace(/^#/, '').toLowerCase();
  const stream = state.streamDetails.get(login);
  const messages = (state.messagesByTarget.get(channel) || []).filter((entry) => entry.kind === 'message');
  const lastMessage = messages[messages.length - 1] || null;
  const activeMessages = messages.filter((entry) => Date.now() - entry.timestamp <= 5 * 60 * 1000).length;
  const recentMessages = messages.filter((entry) => Date.now() - entry.timestamp <= 60 * 1000).length;
  const mentionCount = messages.filter((entry) => entry.direction === 'in' && messageMentionsNick(entry.text)).length;
  const timers = timersForChannel(channel);
  return {
    channel,
    login,
    joined: state.channels.includes(channel),
    autoJoin: channelIsAutoJoined(channel),
    live: state.liveChannels.has(login),
    stream,
    viewerCount: Number(stream?.viewer_count),
    game: stream?.game_name || 'Unknown',
    title: stream?.title || 'Unknown',
    userCount: (state.rosters.get(channel) || new Map()).size,
    messageCount: messages.length,
    activeMessages,
    recentMessages,
    activityLabel: dashboardActivityLabel(recentMessages),
    lastMessage,
    lastMessageAt: lastMessage?.timestamp || 0,
    unread: state.unreadChannels.has(channel),
    mentionCount,
    botEnabled: channelSettingValue(channel, 'botEnabled', true) && (state.settings.botRules || []).some((rule) => rule.enabled && botRuleMatchesChannel(rule, channel)),
    timersEnabled: channelTimersAllowed(channel) && timers.some((timer) => timer.enabled),
    hasTimers: timers.length > 0,
    logsEnabled: channelLogsEnabled(channel),
    sparkline: dashboardSparkline(messages),
  };
}

function filterDashboardCards(cards, filter) {
  return cards.filter((card) => {
    if (filter === 'live') return card.live;
    if (filter === 'offline') return !card.live;
    if (filter === 'active') return card.recentMessages > 0;
    if (filter === 'autoJoin') return card.autoJoin;
    if (filter === 'bot') return card.botEnabled;
    return true;
  });
}

function sortDashboardCards(cards, sort) {
  return cards.slice().sort((a, b) => {
    if (sort === 'activity') return b.recentMessages - a.recentMessages || b.messageCount - a.messageCount || a.channel.localeCompare(b.channel);
    if (sort === 'alpha') return a.channel.localeCompare(b.channel);
    if (sort === 'recent') return b.lastMessageAt - a.lastMessageAt || a.channel.localeCompare(b.channel);
    if (sort === 'viewers') return (b.viewerCount || 0) - (a.viewerCount || 0) || a.channel.localeCompare(b.channel);
    if (a.live !== b.live) return a.live ? -1 : 1;
    return a.channel.localeCompare(b.channel);
  });
}

function renderDashboardCard(card) {
  const item = document.createElement('article');
  item.className = `dashboard-card${card.live ? ' is-live' : ''}${card.joined ? '' : ' is-auto-only'}`;
  item.addEventListener('click', () => {
    if (card.joined) switchToChannel(card.channel);
    else activateTab('chat');
  });

  const header = document.createElement('header');
  header.className = 'dashboard-card-header';
  const title = document.createElement('div');
  title.className = 'dashboard-card-title';
  const liveDot = document.createElement('span');
  liveDot.className = `dashboard-live-dot${card.live ? ' is-live' : ''}`;
  const name = document.createElement('strong');
  name.textContent = channelDisplayName(card.channel);
  title.append(liveDot, name);
  const badges = document.createElement('div');
  badges.className = 'dashboard-card-badges';
  if (card.unread) badges.append(dashboardBadge('Unread', 'warn'));
  if (card.autoJoin) badges.append(dashboardBadge('Auto Join'));
  if (!card.joined) badges.append(dashboardBadge('Not Joined', 'muted'));
  header.append(title, badges);

  const streamLine = document.createElement('div');
  streamLine.className = 'dashboard-stream-line';
  streamLine.textContent = card.live
    ? `Live · ${Number.isFinite(card.viewerCount) ? `${card.viewerCount.toLocaleString()} viewers` : 'Unknown viewers'} · ${card.game}`
    : `Offline · Unknown viewers · ${card.game}`;

  const streamTitle = document.createElement('div');
  streamTitle.className = 'dashboard-stream-title';
  streamTitle.textContent = card.title;

  const metrics = document.createElement('div');
  metrics.className = 'dashboard-metrics';
  metrics.append(
    dashboardMetric('Chat', `${card.userCount} users`),
    dashboardMetric('Messages', String(card.messageCount)),
    dashboardMetric('Activity', card.activityLabel),
    dashboardMetric('Mentions', String(card.mentionCount))
  );

  const sparkline = document.createElement('div');
  sparkline.className = 'dashboard-sparkline';
  card.sparkline.forEach((value) => {
    const bar = document.createElement('span');
    bar.style.height = `${Math.max(3, Math.min(28, 3 + value * 5))}px`;
    sparkline.append(bar);
  });

  const last = document.createElement('div');
  last.className = 'dashboard-last-message';
  if (card.lastMessage) {
    last.append(document.createTextNode('Last: '));
    const quote = document.createElement('span');
    quote.textContent = `“${truncateText(card.lastMessage.text, 90)}” `;
    const by = document.createElement('button');
    by.type = 'button';
    by.className = 'dashboard-user-link';
    by.textContent = `by ${card.lastMessage.nick}`;
    by.addEventListener('click', (event) => {
      event.stopPropagation();
      openUserDrawer(card.channel, card.lastMessage.nick);
    });
    const time = document.createElement('span');
    time.className = 'dashboard-last-time';
    time.textContent = ` · ${formatTime(card.lastMessage.timestamp)}`;
    last.append(quote, by, time);
  } else {
    last.textContent = 'Last: No messages this session';
  }

  const status = document.createElement('div');
  status.className = 'dashboard-status-line';
  status.append(
    dashboardStatus('Bot', card.botEnabled),
    dashboardStatus('Timers', card.hasTimers ? card.timersEnabled : false, card.hasTimers ? '' : 'None'),
    dashboardStatus('Logs', card.logsEnabled)
  );

  const actions = document.createElement('div');
  actions.className = 'dashboard-actions';
  actions.append(
    dashboardAction('Open Chat', () => switchToChannel(card.channel), { disabled: !card.joined }),
    dashboardAction('Open Stream', () => openStreamForChannel(card.channel)),
    dashboardAction(card.joined ? 'Leave' : 'Join', () => (card.joined ? leaveChannel(card.channel) : joinChannelOnce(card.channel)), {
      confirm: card.joined ? `Leave ${card.channel}?` : '',
      disabled: !card.joined && !state.connected,
    }),
    dashboardAction(card.autoJoin ? 'Remove Auto Join' : 'Add Auto Join', () => (
      card.autoJoin ? removeAutoJoinChannel(card.channel) : addChannelToAutoJoin(card.channel)
    ), {
      confirm: card.autoJoin ? `Remove ${card.channel} from Auto Join?` : '',
    }),
    dashboardAction('Run Popup', () => runDashboardPopup(card.channel), {
      disabled: channelPopups(card.channel).length === 0 || !card.joined,
    }),
    dashboardAction('Open Logs', openConfiguredLogFolder, {
      disabled: !state.settings.preferences.channelLogFolder,
    }),
    dashboardAction('Channel Settings', () => openChannelSettings(card.channel))
  );

  item.append(header, streamLine, streamTitle, metrics, sparkline, last, status, actions);
  return item;
}

function dashboardBadge(text, tone = '') {
  const badge = document.createElement('span');
  badge.className = `dashboard-badge${tone ? ` ${tone}` : ''}`;
  badge.textContent = text;
  return badge;
}

function dashboardMetric(label, value) {
  const metric = document.createElement('span');
  metric.className = 'dashboard-metric';
  metric.innerHTML = `<strong>${escapeHtml(label)}</strong><span>${escapeHtml(value)}</span>`;
  return metric;
}

function dashboardStatus(label, enabled, fallback = '') {
  const status = document.createElement('span');
  status.className = `dashboard-status${enabled ? ' is-on' : ''}`;
  status.textContent = `${label}: ${fallback || (enabled ? 'On' : 'Off')}`;
  return status;
}

function dashboardAction(label, action, options = {}) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.disabled = Boolean(options.disabled);
  if (label === 'Leave' || label === 'Remove Auto Join') button.classList.add('danger');
  button.addEventListener('click', async (event) => {
    event.stopPropagation();
    if (options.confirm && !window.confirm(options.confirm)) return;
    await action();
    renderDashboard();
  });
  return button;
}

function dashboardActivityLabel(recentMessages) {
  if (recentMessages >= 8) return 'Very active';
  if (recentMessages >= 3) return 'Active';
  if (recentMessages >= 1) return 'Warming up';
  return 'Quiet';
}

function dashboardSparkline(messages) {
  const now = Date.now();
  const bins = Array(12).fill(0);
  messages.forEach((entry) => {
    const age = now - entry.timestamp;
    if (age < 0 || age > 10 * 60 * 1000) return;
    const index = 11 - Math.floor(age / (50 * 1000));
    bins[Math.max(0, Math.min(11, index))] += 1;
  });
  return bins;
}

function runDashboardPopup(channel) {
  const popup = channelPopups(channel)[0];
  if (!popup) return;
  const command = popup.command.replaceAll('$channel', channel || '');
  runInputForTarget(command, channel);
}

function truncateText(value, maxLength) {
  const text = String(value || '');
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
}

function switchToChannel(channel) {
  const normalized = channel === 'server' ? 'server' : normalizeChannel(channel);
  if (!normalized) return;
  if (state.settings.appearance.twitchPlayer && normalized !== 'server' && normalized !== state.activeChannel) {
    saveCurrentStreamPlayerState();
    state.settings.appearance.twitchPlayerChannel = normalized.replace(/^#/, '').toLowerCase();
    saveSettings();
  }
  state.activeChannel = normalized;
  state.unreadChannels.delete(normalized);
  state.mentionedChannels.delete(normalized);
  if (state.emotePicker.open) renderEmotePickerGrid();
  if (state.userDrawer.open) {
    state.userDrawer.channel = normalized;
    renderUserDrawer();
  }
  renderChannels();
  renderTopic();
  renderRoster();
  renderMessages();
  renderChatActions();
  renderStreamPlayer();
}

function openCommandPalette() {
  state.commandPalette.open = true;
  state.commandPalette.query = '';
  state.commandPalette.selectedIndex = 0;
  el.commandPaletteBackdrop.hidden = false;
  el.commandPaletteInput.value = '';
  renderCommandPalette();
  requestAnimationFrame(() => el.commandPaletteInput.focus());
}

function closeCommandPalette() {
  state.commandPalette.open = false;
  el.commandPaletteBackdrop.hidden = true;
  state.commandPalette.results = [];
}

function handleCommandPaletteKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault();
    closeCommandPalette();
    return;
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    moveCommandPaletteSelection(1);
    return;
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault();
    moveCommandPaletteSelection(-1);
    return;
  }

  if (event.key === 'Enter') {
    event.preventDefault();
    runSelectedCommandPaletteAction();
  }
}

function moveCommandPaletteSelection(direction) {
  const enabled = state.commandPalette.results.filter((command) => !command.disabledReason);
  if (enabled.length === 0) return;
  const selected = state.commandPalette.results[state.commandPalette.selectedIndex];
  const currentEnabledIndex = Math.max(0, enabled.findIndex((command) => command.id === selected?.id));
  const next = enabled[(currentEnabledIndex + direction + enabled.length) % enabled.length];
  state.commandPalette.selectedIndex = state.commandPalette.results.findIndex((command) => command.id === next.id);
  renderCommandPaletteResults();
}

function renderCommandPalette() {
  const query = state.commandPalette.query.trim();
  const commands = commandPaletteCommands(query);
  state.commandPalette.results = query
    ? searchCommandPaletteCommands(commands, query)
    : recentCommandPaletteCommands(commands);
  state.commandPalette.selectedIndex = firstEnabledCommandIndex(state.commandPalette.results);
  renderCommandPaletteResults();
}

function renderCommandPaletteResults() {
  const query = state.commandPalette.query.trim();
  el.commandPaletteResults.innerHTML = '';

  if (state.commandPalette.results.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'command-palette-empty';
    empty.textContent = 'No results found';
    el.commandPaletteResults.append(empty);
    return;
  }

  state.commandPalette.results.forEach((command, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `command-palette-result${index === state.commandPalette.selectedIndex ? ' is-selected' : ''}`;
    button.disabled = Boolean(command.disabledReason);
    button.setAttribute('role', 'option');
    button.setAttribute('aria-selected', index === state.commandPalette.selectedIndex ? 'true' : 'false');

    const icon = document.createElement('span');
    icon.className = `command-palette-icon ${command.category || ''}`;
    icon.textContent = command.icon || '⚡';

    const body = document.createElement('span');
    body.className = 'command-palette-result-body';
    const title = document.createElement('strong');
    title.innerHTML = highlightCommandPaletteMatch(command.title, query);
    const subtitle = document.createElement('span');
    subtitle.innerHTML = highlightCommandPaletteMatch(command.disabledReason || command.subtitle || '', query);
    body.append(title, subtitle);

    const category = document.createElement('span');
    category.className = 'command-palette-category';
    category.textContent = command.categoryLabel || command.category || '';

    button.append(icon, body, category);
    button.addEventListener('pointermove', () => {
      if (command.disabledReason) return;
      state.commandPalette.selectedIndex = index;
      renderCommandPaletteResults();
    });
    button.addEventListener('click', () => runCommandPaletteAction(command));
    el.commandPaletteResults.append(button);
  });
}

function commandPaletteCommands(query = '') {
  const currentChannel = isServerTarget(state.activeChannel) ? '' : normalizeChannel(state.activeChannel);
  const commands = [
    paletteCommand('focus-chat', 'Focus chat input', 'Put the cursor in the message box.', 'Chat', '@', 'chat input message focus', () => {
      activateTab('chat');
      el.messageInput.focus();
    }, { disabledReason: isServerTarget(state.activeChannel) ? 'The Server tab does not have a message input.' : '' }),
    paletteCommand('clear-chat', 'Clear current chat view', 'Remove messages from this local view only.', 'Chat', '@', 'clear current chat local view', clearCurrentChatView, {
      confirmation: `Clear the local chat view for ${state.activeChannel || 'this tab'}? This does not affect Twitch.`,
      disabledReason: state.activeChannel ? '' : 'No active channel to clear.',
    }),
    paletteCommand('copy-channel', 'Copy current channel name', currentChannel || 'No channel selected.', 'Channel', '#', 'copy channel current', copyCurrentChannelName, {
      disabledReason: currentChannel ? '' : 'Switch to a channel tab first.',
    }),
    paletteCommand('leave-current-channel', currentChannel ? `Leave ${currentChannel}` : 'Leave current channel', 'Part from the active channel.', 'Channel', '#', 'leave part current channel', () => leaveChannel(currentChannel), {
      confirmation: currentChannel ? `Leave ${currentChannel}?` : '',
      disabledReason: currentChannel ? '' : 'Switch to a channel tab first.',
    }),
    paletteCommand('add-current-auto-join', currentChannel ? `Add ${currentChannel} to Auto Join` : 'Add current channel to Auto Join', 'Join this channel automatically next time.', 'Channel', '#', 'auto join add current channel', () => addChannelToAutoJoin(currentChannel), {
      disabledReason: !currentChannel
        ? 'Switch to a channel tab first.'
        : (channelIsAutoJoined(currentChannel) ? `${currentChannel} is already in Auto Join.` : ''),
    }),
    paletteCommand('channel-settings', currentChannel ? `Channel Settings: ${currentChannel}` : 'Channel Settings', 'Open per-channel settings for the active channel.', 'Settings', '⚙', 'channel settings overrides', () => openChannelSettings(currentChannel), {
      disabledReason: currentChannel ? '' : 'Switch to a channel tab first.',
    }),
    paletteCommand('open-logs-folder', 'Open Logs Folder', 'Open the configured channel log folder.', 'Settings', '⚙', 'logs folder open channel log', openConfiguredLogFolder, {
      disabledReason: state.settings.preferences.channelLogFolder ? '' : 'Choose a channel log folder in Settings first.',
    }),
    paletteCommand('open-dashboard', 'Open Dashboard', 'View every joined and auto-join channel at once.', 'Navigation', '▦', 'dashboard command center overview multi channel', () => activateTab('dashboard')),
    paletteCommand('open-chat', 'Open Chat', 'Go to the chat workspace.', 'Navigation', '⚡', 'chat page tab', () => activateTab('chat')),
    paletteCommand('open-bot', 'Open Bot Builder', 'Build self-hosted bot rules.', 'Bot', '/', 'bot builder rules', () => activateTab('bot')),
    paletteCommand('open-commands', 'Open Commands', 'Manage mIRC and Python command scripts.', 'Command', '/', 'commands aliases scripts python mirc', () => activateTab('commands')),
    paletteCommand('new-command', 'Create new command', 'Open Commands and focus the command name.', 'Command', '/', 'new command alias create', () => {
      activateTab('commands');
      el.aliasName.focus();
    }),
    paletteCommand('open-popups', 'Open Popups', 'Manage quick popup buttons.', 'Popup', '⚡', 'popups buttons actions', () => activateTab('popups')),
    paletteCommand('new-popup', 'Create new popup', 'Open Popups and focus the label field.', 'Popup', '⚡', 'new popup action create', () => {
      activateTab('popups');
      el.popupLabel.focus();
    }),
    paletteCommand('open-timers', 'Open Timers', 'Manage timed messages.', 'Timer', '◷', 'timers timed messages clock', () => activateTab('timers')),
    paletteCommand('new-timer', 'Create new timer', 'Open Timers and focus the message field.', 'Timer', '◷', 'new timer timed message create', () => {
      activateTab('timers');
      renderTimerChannelOptions();
      if (currentChannel) el.timerChannel.value = currentChannel;
      el.timerMessage.focus();
    }),
    paletteCommand('open-raw', 'Open Raw IRC', 'View protocol traffic and server notices.', 'Navigation', '⚡', 'raw irc protocol', () => activateTab('raw')),
    paletteCommand('open-docs', 'Open Docs', 'Read the in-app guide.', 'Navigation', '⚙', 'docs help guide wiki', () => activateTab('docs')),
    paletteCommand('open-whatsnew', "Open What's New", 'See every release and what changed.', 'Navigation', '⚙', 'whatsnew changelog updates release notes version', () => activateTab('whatsnew')),
    paletteCommand('open-settings', 'Open Settings', 'Open preferences, backups, and updates.', 'Settings', '⚙', 'settings preferences updates backups', () => activateTab('settings')),
    paletteCommand('show-stream', 'Show stream preview', 'Open the stream player for the active channel.', 'Stream', '⚡', 'stream video show watch', () => setStreamPreviewVisible(true), {
      disabledReason: streamChannelFromActiveChannel() ? '' : 'Switch to a channel tab first.',
    }),
    paletteCommand('hide-stream', 'Hide stream preview', 'Close the stream player.', 'Stream', '⚡', 'stream video hide', () => setStreamPreviewVisible(false), {
      disabledReason: state.settings.appearance.twitchPlayer ? '' : 'The stream preview is already hidden.',
    }),
    paletteCommand('stream-play', 'Play stream', 'Resume the current stream preview.', 'Stream', '⚡', 'stream video play resume', () => setStreamPaused(false), {
      disabledReason: state.streamPlayer ? '' : 'Open a stream preview first.',
    }),
    paletteCommand('stream-pause', 'Pause stream', 'Pause the current stream preview.', 'Stream', '⚡', 'stream video pause', () => setStreamPaused(true), {
      disabledReason: state.streamPlayer ? '' : 'Open a stream preview first.',
    }),
    paletteCommand('stream-mute', 'Mute stream', 'Mute the current stream preview.', 'Stream', '⚡', 'stream video mute', () => setStreamMuted(true), {
      disabledReason: state.streamPlayer ? '' : 'Open a stream preview first.',
    }),
    paletteCommand('stream-unmute', 'Unmute stream', 'Unmute the current stream preview.', 'Stream', '⚡', 'stream video unmute volume', () => setStreamMuted(false), {
      disabledReason: state.streamPlayer ? '' : 'Open a stream preview first.',
    }),
    paletteCommand('stream-next', 'Next stream', 'Move to the next available stream.', 'Stream', '⚡', 'stream video next', () => navigateStream(1), {
      disabledReason: streamChannels().length > 1 ? '' : 'There is only one stream target.',
    }),
    paletteCommand('stream-previous', 'Previous stream', 'Move to the previous available stream.', 'Stream', '⚡', 'stream video previous prev', () => navigateStream(-1), {
      disabledReason: streamChannels().length > 1 ? '' : 'There is only one stream target.',
    }),
  ];

  const joinChannel = joinChannelFromPaletteQuery(query);
  if (joinChannel && !state.channels.includes(joinChannel)) {
    commands.unshift(paletteCommand(`join-${joinChannel}`, `Join ${joinChannel}`, 'Join once without adding it to Auto Join.', 'Channel', '#', `join ${joinChannel}`, () => joinChannelOnce(joinChannel), {
      disabledReason: state.connected ? '' : 'Connect before joining a channel.',
    }));
  }

  const autoJoinChannel = autoJoinChannelFromPaletteQuery(query);
  if (autoJoinChannel && !channelIsAutoJoined(autoJoinChannel)) {
    commands.unshift(paletteCommand(`auto-join-${autoJoinChannel}`, `Auto Join ${autoJoinChannel}`, 'Add this channel to Auto Join.', 'Channel', '#', `auto join ${autoJoinChannel}`, () => addChannelToAutoJoin(autoJoinChannel)));
  }

  state.channels.forEach((channel) => {
    commands.push(paletteCommand(`switch-${channel}`, `Switch ${channel}`, 'Open this joined channel tab.', 'Channel', '#', `switch channel ${channel}`, () => switchToChannel(channel)));
    commands.push(paletteCommand(`leave-${channel}`, `Leave ${channel}`, 'Part from this channel.', 'Channel', '#', `leave part ${channel}`, () => leaveChannel(channel), {
      confirmation: `Leave ${channel}?`,
    }));
  });

  state.settings.connection.autoJoinChannels.forEach((channel) => {
    commands.push(paletteCommand(`remove-auto-join-${channel}`, `Remove ${channel} from Auto Join`, 'Stop joining this channel automatically.', 'Channel', '#', `remove auto join ${channel}`, () => removeAutoJoinChannel(channel), {
      confirmation: `Remove ${channel} from Auto Join?`,
    }));
  });

  nickCompletionCandidates().slice(0, 40).forEach((nick) => {
    commands.push(paletteCommand(`mention-${nick.toLowerCase()}`, `Mention ${nick}`, 'Insert this name into the message box.', 'User', '@', `mention user profile ${nick}`, () => mentionUser(nick), {
      disabledReason: isServerTarget(state.activeChannel) ? 'Switch to a channel tab first.' : '',
    }));
    commands.push(paletteCommand(`profile-${nick.toLowerCase()}`, `Open profile for ${nick}`, 'Show roles, recent messages, notes, and moderation actions.', 'User', '@', `profile user drawer ${nick}`, () => openUserDrawer(state.activeChannel, nick), {
      disabledReason: isServerTarget(state.activeChannel) ? 'Switch to a channel tab first.' : '',
    }));
  });

  state.settings.aliases.forEach((alias) => {
    commands.push(paletteCommand(`command-${alias.name}`, `Command /${alias.name}`, `${alias.type === 'python' ? 'Python' : 'mIRC'} command script.`, 'Command', '/', `command alias script ${alias.name} ${alias.output}`, () => {
      activateTab('commands');
      el.aliasName.value = alias.name;
      el.aliasMode.value = alias.type === 'python' ? 'python' : 'mirc';
      el.aliasOutput.value = alias.output;
      el.aliasOutput.focus();
    }));
  });

  state.settings.botRules.forEach((rule) => {
    const name = rule.name || botRuleFallbackName(rule.triggerType, rule.triggerValue);
    commands.push(paletteCommand(`toggle-bot-rule-${rule.id}`, `${rule.enabled ? 'Disable' : 'Enable'} bot rule: ${name}`, botRuleSummary(rule), 'Bot', '/', `bot rule toggle ${name}`, async () => {
      rule.enabled = !rule.enabled;
      await saveSettings();
      renderBotRules();
      renderChannelStatusStrip();
    }));
  });

  state.settings.timedMessages.forEach((timer) => {
    const summary = `${timer.channel} · Every ${formatTimerInterval(timer)} · ${timer.message}`;
    commands.push(paletteCommand(`open-timer-${timer.id}`, `Timer: ${timer.message}`, summary, 'Timer', '◷', `timer ${timer.channel} ${timer.message}`, () => {
      activateTab('timers');
      renderTimerChannelOptions();
      el.timerChannel.value = normalizeChannel(timer.channel);
    }));
    commands.push(paletteCommand(`toggle-timer-${timer.id}`, `${timer.enabled ? 'Pause' : 'Resume'} timer: ${timer.message}`, summary, 'Timer', '◷', `pause resume timer ${timer.channel} ${timer.message}`, async () => {
      timer.enabled = !timer.enabled;
      if (timer.enabled) clearExpiredDeadline(timer);
      await saveSettings();
      scheduleTimer(timer);
      renderTimers();
      renderTimerPills();
    }));
    commands.push(paletteCommand(`send-timer-${timer.id}`, `Send timer now: ${timer.message}`, summary, 'Timer', '◷', `send timer now ${timer.channel} ${timer.message}`, () => sendTimerNow(timer), {
      disabledReason: state.connected ? '' : 'Connect before sending a timer.',
    }));
  });

  state.settings.popups.forEach((popup, index) => {
    const command = popup.command.replaceAll('$channel', state.activeChannel || '');
    const isLeave = /^\/(?:part|leave)\b/i.test(command) || /leave/i.test(popup.label);
    commands.push(paletteCommand(`popup-${index}-${popup.label}`, popup.label, `Run popup action: ${popup.command}`, 'Popup', '⚡', `popup action ${popup.label} ${popup.command}`, () => runInput(command), {
      confirmation: isLeave ? `Run "${popup.label}"? This may leave the current channel.` : '',
      disabledReason: isServerTarget(state.activeChannel) ? 'Switch to a channel tab first.' : '',
    }));
  });

  return commands;
}

function paletteCommand(id, title, subtitle, category, icon, keywords, action, options = {}) {
  return {
    id,
    title,
    subtitle,
    category: category.toLowerCase(),
    categoryLabel: category,
    icon,
    keywords,
    action,
    confirmation: options.confirmation || '',
    disabledReason: options.disabledReason || '',
  };
}

function searchCommandPaletteCommands(commands, query) {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  return commands
    .map((command) => ({ command, score: commandPaletteScore(command, tokens, query) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.command.title.localeCompare(b.command.title))
    .slice(0, 50)
    .map((entry) => entry.command);
}

function commandPaletteScore(command, tokens, query) {
  const haystack = `${command.title} ${command.subtitle} ${command.categoryLabel} ${command.keywords}`.toLowerCase();
  if (!tokens.every((token) => haystack.includes(token))) return 0;
  const title = command.title.toLowerCase();
  let score = 10;
  if (title.startsWith(query.toLowerCase())) score += 20;
  if (title.includes(query.toLowerCase())) score += 8;
  if (!command.disabledReason) score += 3;
  return score;
}

function recentCommandPaletteCommands(commands) {
  const recentIds = state.settings.preferences.recentCommandPaletteActions || [];
  const byId = new Map(commands.map((command) => [command.id, command]));
  const recent = recentIds.map((id) => byId.get(id)).filter(Boolean);
  if (recent.length > 0) return recent.slice(0, 10);
  return commands.filter((command) => [
    'focus-chat',
    'open-dashboard',
    'open-bot',
    'open-commands',
    'new-timer',
    'open-settings',
    'show-stream',
  ].includes(command.id));
}

function firstEnabledCommandIndex(commands) {
  const index = commands.findIndex((command) => !command.disabledReason);
  return Math.max(0, index);
}

function highlightCommandPaletteMatch(value, query) {
  let escaped = escapeHtml(value || '');
  const trimmed = query.trim();
  if (!trimmed) return escaped;
  trimmed.split(/\s+/).filter(Boolean).forEach((token) => {
    const safe = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    escaped = escaped.replace(new RegExp(`(${safe})`, 'ig'), '<mark>$1</mark>');
  });
  return escaped;
}

async function runSelectedCommandPaletteAction() {
  const command = state.commandPalette.results[state.commandPalette.selectedIndex];
  if (command) await runCommandPaletteAction(command);
}

async function runCommandPaletteAction(command) {
  if (!command || command.disabledReason) return;
  if (command.confirmation && !window.confirm(command.confirmation)) return;
  closeCommandPalette();
  await command.action();
  recordCommandPaletteAction(command.id);
}

function recordCommandPaletteAction(id) {
  const recent = state.settings.preferences.recentCommandPaletteActions || [];
  state.settings.preferences.recentCommandPaletteActions = [id, ...recent.filter((entry) => entry !== id)].slice(0, 12);
  saveSettings();
}

function joinChannelFromPaletteQuery(query) {
  const match = String(query || '').trim().match(/^(?:join|\/join)\s+(#?[a-z0-9_]{1,25})$/i);
  return match ? normalizeChannel(match[1]) : '';
}

function autoJoinChannelFromPaletteQuery(query) {
  const match = String(query || '').trim().match(/^auto\s+join\s+(#?[a-z0-9_]{1,25})$/i);
  return match ? normalizeChannel(match[1]) : '';
}

async function joinChannelOnce(channel) {
  const normalized = normalizeChannel(channel);
  if (!normalized || !state.connected) return;
  window.macIRC.send({ target: normalized, text: `/join ${normalized}` });
  appendStatus(`Joining ${normalized}.`, 'info');
}

async function addChannelToAutoJoin(channel) {
  const normalized = normalizeChannel(channel);
  if (!normalized || isServerTarget(normalized) || channelIsAutoJoined(normalized)) return;
  setChannelSetting(normalized, 'autoJoin', true);
  state.settings.connection.autoJoinChannels = uniqueChannels([
    ...state.settings.connection.autoJoinChannels,
    normalized,
  ]);
  await saveSettings();
  renderAutoJoinChannels();
  renderChatActions();
}

async function removeAutoJoinChannel(channel) {
  const normalized = normalizeChannel(channel);
  setChannelSetting(normalized, 'autoJoin', false);
  state.settings.connection.autoJoinChannels = state.settings.connection.autoJoinChannels
    .filter((entry) => normalizeChannel(entry) !== normalized);
  await saveSettings();
  renderAutoJoinChannels();
  renderChatActions();
}

function clearCurrentChatView() {
  if (!state.activeChannel) return;
  state.messagesByTarget.set(state.activeChannel, []);
  scheduleHistorySave();
  renderMessages();
  appendStatus(`Cleared ${state.activeChannel} from this local view.`, 'info');
}

async function copyCurrentChannelName() {
  const channel = normalizeChannel(state.activeChannel);
  if (!channel || isServerTarget(channel)) return;
  await navigator.clipboard.writeText(channel);
  appendStatus(`Copied ${channel} to clipboard.`, 'info');
}

function mentionUser(nick) {
  if (!nick || isServerTarget(state.activeChannel)) return;
  activateTab('chat');
  const current = el.messageInput.value;
  el.messageInput.value = `${current}${current && !current.endsWith(' ') ? ' ' : ''}@${nick} `;
  el.messageInput.focus();
}

async function openConfiguredLogFolder() {
  const folder = state.settings.preferences.channelLogFolder;
  if (!folder) return;
  const result = await window.macIRC.openLogFolder(folder);
  if (!result?.ok) appendStatus(`Could not open logs folder: ${result?.error || 'unknown error'}`, 'error');
}

async function setStreamPreviewVisible(visible) {
  if (visible) {
    const channel = streamChannelFromActiveChannel();
    if (!channel) return;
    state.settings.appearance.twitchPlayer = true;
    state.settings.appearance.twitchPlayerChannel = channel;
  } else {
    saveCurrentStreamPlayerState();
    state.settings.appearance.twitchPlayer = false;
    state.settings.appearance.twitchPlayerChannel = '';
  }
  await saveSettings();
  renderStreamPlayer();
}

async function openStreamForChannel(channel) {
  const normalized = normalizeChannel(channel);
  if (!normalized || isServerTarget(normalized)) return;
  if (!channelSettingValue(normalized, 'stream.showPreview', true)) {
    appendStatus(`Stream preview is disabled for ${normalized}.`, 'error');
    return;
  }
  saveCurrentStreamPlayerState();
  state.settings.appearance.twitchPlayer = true;
  state.settings.appearance.twitchPlayerChannel = normalized.replace(/^#/, '').toLowerCase();
  await saveSettings();
  renderStreamPlayer();
}

function setStreamPaused(paused) {
  if (!state.streamPlayer) return;
  state.streamUserPaused = paused;
  try {
    if (paused) state.streamPlayer.pause();
    else state.streamPlayer.play();
    setTimeout(() => {
      saveCurrentStreamPlayerState();
      updateStreamControlButtons();
    }, 100);
  } catch {
    updateStreamControlButtons();
  }
}

function setStreamMuted(muted) {
  if (!state.streamPlayer) return;
  try {
    state.streamPlayer.setMuted(muted);
    setTimeout(() => {
      saveCurrentStreamPlayerState();
      updateStreamControlButtons();
    }, 100);
  } catch {
    updateStreamControlButtons();
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
      state.mentionedChannels.has(channel) ? 'has-mention' : '',
      isLive ? 'is-live' : '',
    ].filter(Boolean).join(' ');
    button.textContent = channel === 'server' ? 'Server' : channelDisplayName(channel);
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
    button.addEventListener('click', () => switchToChannel(channel));
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
  renderDashboard();
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
    const aLive = channelSettingValue(a, 'moveTabToFrontWhenLive', true) && state.liveChannels.has(a.replace(/^#/, '').toLowerCase());
    const bLive = channelSettingValue(b, 'moveTabToFrontWhenLive', true) && state.liveChannels.has(b.replace(/^#/, '').toLowerCase());
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

  const settingsOption = document.createElement('button');
  settingsOption.type = 'button';
  settingsOption.textContent = 'Channel Settings';
  settingsOption.addEventListener('click', () => {
    hideContextMenu();
    openChannelSettings(normalized);
  });

  menu.append(settingsOption, leaveOption);
  document.body.append(menu);
  positionContextMenu(menu, event.clientX, event.clientY);
  state.activeContextMenu = menu;
}

function renderStreamInfoHeader() {
  if (!el.streamInfoHeader) return;
  const channel = streamChannelFromActiveChannel();
  const showHeader = isTwitchStyleLayout() && state.settings.appearance.twitchPlayer && Boolean(channel);
  el.streamInfoHeader.hidden = !showHeader;
  if (!showHeader) return;

  const details = state.streamDetails.get(channel.toLowerCase()) || {};
  const isLive = state.liveChannels.has(channel.toLowerCase());
  el.streamInfoHeader.innerHTML = '';

  if (isLive) {
    const live = document.createElement('span');
    live.className = 'stream-info-live';
    live.textContent = 'Live';
    el.streamInfoHeader.append(live);
  }

  const name = document.createElement('span');
  name.className = 'stream-info-name';
  name.textContent = `#${channel}`;
  el.streamInfoHeader.append(name);

  const metaParts = [];
  if (details.game_name) metaParts.push(details.game_name);
  if (typeof details.viewer_count === 'number') metaParts.push(`${details.viewer_count.toLocaleString()} viewers`);
  if (metaParts.length > 0) {
    const meta = document.createElement('span');
    meta.className = 'stream-info-meta';
    meta.textContent = metaParts.join(' • ');
    el.streamInfoHeader.append(meta);
  }
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
  const botOn = channelSettingValue(channel, 'botEnabled', true) && (state.settings.botRules || []).some((rule) => rule.enabled && botRuleMatchesChannel(rule, channel));
  const logsOn = channelLogsEnabled(channel);

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

  const settingsButton = document.createElement('button');
  settingsButton.type = 'button';
  settingsButton.className = 'channel-settings-chip';
  settingsButton.textContent = 'Channel Settings';
  settingsButton.addEventListener('click', () => openChannelSettings(channel));
  el.channelStatusStrip.append(settingsButton);
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

function channelTimersAllowed(channel) {
  return Boolean(
    channelSettingValue(channel, 'timersEnabled', true)
    && channelSettingValue(channel, 'timers.enabled', true)
    && channelSettingValue(channel, 'timers.allowGlobal', true)
    && !channelSettingValue(channel, 'timers.pauseAll', false)
  );
}

function openActiveChannelTimers() {
  const channel = normalizeChannel(state.activeChannel);
  activateTab('timers');
  renderTimerChannelOptions();
  if (channel && state.channels.includes(channel)) el.timerChannel.value = channel;
}

function isTwitchStyleLayout() {
  return state.settings.appearance.layout === 'twitchStyle';
}

function renderStreamPlayer() {
  const configuredChannel = state.settings.appearance.twitchPlayerChannel || streamChannelFromActiveChannel();
  const enabled = state.settings.appearance.twitchPlayer && Boolean(configuredChannel);
  el.streamSidebarButton.textContent = enabled ? 'Hide Stream' : 'Watch Active Stream';
  el.streamPanel.hidden = !enabled;
  if (el.chatStreamSlot) el.chatStreamSlot.hidden = !enabled || !isTwitchStyleLayout();
  if (el.streamEmptyState) el.streamEmptyState.hidden = enabled || !isTwitchStyleLayout();
  renderStreamInfoHeader();
  if (!enabled) {
    clearStreamPlayer();
    return;
  }
  applyStreamPanelPlacement();

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
  state.streamUserPaused = Boolean(playerState.paused);
  state.streamPlayer.addEventListener(window.Twitch.Player.READY, () => {
    if (typeof playerState.volume === 'number') state.streamPlayer.setVolume(playerState.volume);
    state.streamPlayer.setMuted(Boolean(playerState.muted));
    if (playerState.paused) state.streamPlayer.pause();
    updateStreamControlButtons();
  });
  state.streamPlayer.addEventListener(window.Twitch.Player.ENDED, () => {
    if (!state.streamUserPaused) state.streamPlayer?.play();
  });
  startStreamWatchdog();
  startStreamLatencyPolling();
}

function startStreamWatchdog() {
  stopStreamWatchdog();
  state.streamWatchdog = setInterval(() => {
    if (!state.streamPlayer || state.streamUserPaused) return;
    try {
      if (state.streamPlayer.isPaused()) state.streamPlayer.play();
    } catch {
      // player not ready yet, ignore until the next tick
    }
  }, 4000);
}

function stopStreamWatchdog() {
  if (state.streamWatchdog) clearInterval(state.streamWatchdog);
  state.streamWatchdog = null;
}

function startStreamLatencyPolling() {
  stopStreamLatencyPolling();
  updateStreamLatencyLabel();
  state.streamLatencyTimer = setInterval(updateStreamLatencyLabel, 3000);
}

function stopStreamLatencyPolling() {
  if (state.streamLatencyTimer) clearInterval(state.streamLatencyTimer);
  state.streamLatencyTimer = null;
  if (el.streamLatency) el.streamLatency.hidden = true;
}

function updateStreamLatencyLabel() {
  if (!el.streamLatency || !state.streamPlayer) return;
  try {
    const stats = state.streamPlayer.getPlaybackStats?.();
    const latency = Number(stats?.hlsLatencyBroadcaster);
    if (!Number.isFinite(latency) || latency <= 0) {
      el.streamLatency.hidden = true;
      return;
    }
    el.streamLatency.hidden = false;
    el.streamLatency.textContent = `${latency.toFixed(1)}s behind`;
    el.streamLatency.classList.toggle('is-high', latency > 8);
  } catch {
    el.streamLatency.hidden = true;
  }
}

function catchUpStreamToLiveEdge() {
  if (!state.streamPlayer) return;
  try {
    state.streamPlayer.pause();
    setTimeout(() => {
      if (!state.streamUserPaused) state.streamPlayer?.play();
      setTimeout(updateStreamLatencyLabel, 1500);
    }, 250);
  } catch {
    // ignore; the player may not be ready yet
  }
}

function clearStreamPlayer() {
  stopStreamWatchdog();
  stopStreamLatencyPolling();
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
    if (state.streamPlayer.isPaused()) {
      state.streamUserPaused = false;
      state.streamPlayer.play();
    } else {
      state.streamUserPaused = true;
      state.streamPlayer.pause();
    }
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
  const saved = state.settings.appearance.twitchPlayerStates?.[channel];
  if (saved && channelSettingValue(`#${channel}`, 'stream.rememberVolume', true)) return saved;
  return {
    muted: channelSettingValue(`#${channel}`, 'stream.muteByDefault', false),
    paused: false,
    volume: channelSettingValue(`#${channel}`, 'stream.volume', 0.5),
  };
}

const STREAM_PANEL_MIN_WIDTH = 240;
const STREAM_PANEL_MIN_HEIGHT = 170;
const STREAM_PANEL_DRAG_THRESHOLD = 6;
const STREAM_REDOCK_ZONE_PX = 200;

function isStreamPanelDocked() {
  return state.settings.appearance.twitchPlayerDocked !== false;
}

function streamPanelBounds() {
  const saved = state.settings.appearance.twitchPlayerBounds || {};
  return {
    x: Number.isFinite(saved.x) ? saved.x : 360,
    y: Number.isFinite(saved.y) ? saved.y : 90,
    width: Number.isFinite(saved.width) ? saved.width : 480,
    height: Number.isFinite(saved.height) ? saved.height : 295,
  };
}

function applyStreamPanelPlacement() {
  if (isTwitchStyleLayout()) {
    el.streamPanel.classList.remove('is-docked', 'is-floating');
    el.streamPanel.classList.add('is-inline');
    el.streamPanel.style.left = '';
    el.streamPanel.style.top = '';
    el.streamPanel.style.width = '';
    el.streamPanel.style.height = '';
    if (!el.chatStreamSlot.contains(el.streamPanel)) el.chatStreamSlot.append(el.streamPanel);
    return;
  }
  el.streamPanel.classList.remove('is-inline');
  if (isStreamPanelDocked()) {
    el.streamPanel.classList.remove('is-floating');
    el.streamPanel.classList.add('is-docked');
    el.streamPanel.style.left = '';
    el.streamPanel.style.top = '';
    el.streamPanel.style.width = '';
    el.streamPanel.style.height = '';
    if (!el.streamDockSlot.contains(el.streamPanel)) el.streamDockSlot.append(el.streamPanel);
    return;
  }
  el.streamPanel.classList.remove('is-docked');
  el.streamPanel.classList.add('is-floating');
  if (!el.appShell.contains(el.streamPanel) || el.streamDockSlot.contains(el.streamPanel)) {
    el.appShell.append(el.streamPanel);
  }
  const bounds = clampStreamPanelBounds(streamPanelBounds());
  el.streamPanel.style.left = `${bounds.x}px`;
  el.streamPanel.style.top = `${bounds.y}px`;
  el.streamPanel.style.width = `${bounds.width}px`;
  el.streamPanel.style.height = `${bounds.height}px`;
}

function clampStreamPanelBounds(bounds) {
  const maxWidth = Math.max(STREAM_PANEL_MIN_WIDTH, window.innerWidth - 24);
  const maxHeight = Math.max(STREAM_PANEL_MIN_HEIGHT, window.innerHeight - 24);
  const width = Math.min(maxWidth, Math.max(STREAM_PANEL_MIN_WIDTH, bounds.width));
  const height = Math.min(maxHeight, Math.max(STREAM_PANEL_MIN_HEIGHT, bounds.height));
  const x = Math.min(Math.max(0, window.innerWidth - width), Math.max(0, bounds.x));
  const y = Math.min(Math.max(0, window.innerHeight - height), Math.max(0, bounds.y));
  return { x, y, width, height };
}

function clampStreamPanelToWindow() {
  if (el.streamPanel.hidden || isStreamPanelDocked() || isTwitchStyleLayout()) return;
  applyStreamPanelPlacement();
}

async function saveStreamPanelBounds(bounds, docked) {
  state.settings.appearance.twitchPlayerBounds = clampStreamPanelBounds(bounds);
  state.settings.appearance.twitchPlayerDocked = docked;
  await saveSettings();
}

function startStreamDrag(event) {
  if (!state.settings.appearance.twitchPlayer || isTwitchStyleLayout()) return;
  if (event.target.closest('button')) return;
  event.preventDefault();
  const startX = event.clientX;
  const startY = event.clientY;
  let docked = isStreamPanelDocked();
  let start = docked
    ? { ...el.streamPanel.getBoundingClientRect() }
    : streamPanelBounds();

  const undock = (moveEvent) => {
    docked = false;
    const rect = el.streamPanel.getBoundingClientRect();
    start = { x: rect.left, y: rect.top, width: rect.width, height: rect.height };
    state.settings.appearance.twitchPlayerDocked = false;
    el.streamPanel.classList.remove('is-docked');
    el.streamPanel.classList.add('is-floating');
    el.appShell.append(el.streamPanel);
    el.streamPanel.style.left = `${start.x}px`;
    el.streamPanel.style.top = `${start.y}px`;
    el.streamPanel.style.width = `${start.width}px`;
    el.streamPanel.style.height = `${start.height}px`;
    moveTo(moveEvent);
  };

  const moveTo = (moveEvent) => {
    const next = clampStreamPanelBounds({
      ...start,
      x: start.x + (moveEvent.clientX - startX),
      y: start.y + (moveEvent.clientY - startY),
    });
    el.streamPanel.style.left = `${next.x}px`;
    el.streamPanel.style.top = `${next.y}px`;
  };

  const onMove = (moveEvent) => {
    if (docked) {
      const moved = Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY);
      if (moved < STREAM_PANEL_DRAG_THRESHOLD) return;
      undock(moveEvent);
      return;
    }
    moveTo(moveEvent);
  };

  const onUp = async (upEvent) => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    if (docked) return;
    const next = clampStreamPanelBounds({
      ...start,
      x: start.x + (upEvent.clientX - startX),
      y: start.y + (upEvent.clientY - startY),
    });
    if (next.x < STREAM_REDOCK_ZONE_PX) {
      await saveStreamPanelBounds(next, true);
      renderStreamPlayer();
      return;
    }
    await saveStreamPanelBounds(next, false);
  };

  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
}

function startStreamPanelResize(event) {
  if (!state.settings.appearance.twitchPlayer || isStreamPanelDocked() || isTwitchStyleLayout()) return;
  event.preventDefault();
  event.stopPropagation();
  const startX = event.clientX;
  const startY = event.clientY;
  const start = streamPanelBounds();

  const onMove = (moveEvent) => {
    const next = clampStreamPanelBounds({
      ...start,
      width: start.width + (moveEvent.clientX - startX),
      height: start.height + (moveEvent.clientY - startY),
    });
    el.streamPanel.style.width = `${next.width}px`;
    el.streamPanel.style.height = `${next.height}px`;
  };

  const onUp = async (upEvent) => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    const next = clampStreamPanelBounds({
      ...start,
      width: start.width + (upEvent.clientX - startX),
      height: start.height + (upEvent.clientY - startY),
    });
    await saveStreamPanelBounds(next, false);
  };

  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
}

function renderRoster() {
  el.roster.innerHTML = '';
  renderChannelStatusStrip();
  if (isServerTarget(state.activeChannel)) {
    el.rosterCount.textContent = '0';
    renderDashboard();
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
    renderDashboard();
    return;
  }

  users.forEach((user) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `roster-user${user.role ? ` ${user.role}` : ''}${isMonitored(user.nick) ? ' monitored' : ''}${isHidden(user.nick) ? ' hidden-chat' : ''}`;
    appendRoleIcon(item, user.role);
    item.append(document.createTextNode(user.nick));
    item.addEventListener('click', () => {
      openUserDrawer(state.activeChannel, user.nick);
    });
    item.addEventListener('contextmenu', (event) => {
      event.preventDefault();
      showRosterContextMenu(event, user.nick);
    });
    el.roster.append(item);
  });
  renderDashboard();
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
      setChannelSetting(channel, 'autoJoin', false);
      state.settings.connection.autoJoinChannels = state.settings.connection.autoJoinChannels
        .filter((entry) => entry !== channel);
      await saveSettings();
      renderAutoJoinChannels();
      renderChatActions();
      renderDashboard();
    });
    item.append(name, remove);
    el.autoJoinList.append(item);
  });
}

function updateNickSuggestion() {
  const commandMatch = commandCompletionMatch();
  if (commandMatch) {
    const prefix = commandMatch.query.toLowerCase();
    const suggestion = commandCompletionCandidates()
      .find((command) => command.toLowerCase().startsWith(prefix) && command.toLowerCase() !== prefix);
    if (suggestion) {
      state.nickSuggestion = '';
      state.commandSuggestion = suggestion;
      el.nickSuggest.hidden = false;
      el.nickSuggest.textContent = `Tab: /${suggestion}`;
      return;
    }
  }

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
  state.commandSuggestion = '';
  el.nickSuggest.hidden = false;
  el.nickSuggest.textContent = `Tab: @${suggestion}`;
}

function applyNickSuggestion() {
  if (state.commandSuggestion) {
    const match = commandCompletionMatch();
    if (!match) return;
    const value = el.messageInput.value;
    el.messageInput.value = `${value.slice(0, match.start)}/${state.commandSuggestion}${value.slice(match.end)}`;
    const caret = match.start + state.commandSuggestion.length + 1;
    el.messageInput.setSelectionRange(caret, caret);
    hideNickSuggestion();
    return;
  }

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
  state.commandSuggestion = '';
  el.nickSuggest.hidden = true;
  el.nickSuggest.textContent = '';
}

function commandCompletionMatch() {
  const value = el.messageInput.value;
  const caret = el.messageInput.selectionStart ?? value.length;
  const beforeCaret = value.slice(0, caret);
  const match = beforeCaret.match(/^\/([A-Za-z0-9_-]{0,25})$/);
  if (!match) return null;
  return {
    start: 0,
    end: caret,
    query: match[1],
  };
}

function commandCompletionCandidates() {
  return Array.from(new Set([
    'join',
    'part',
    'me',
    'timeout',
    'ban',
    'unban',
    ...state.settings.aliases.map((alias) => alias.name),
  ].map((command) => normalizeCommandName(command)).filter(Boolean)));
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
  if (!channelSettingValue(state.activeChannel, 'popupsEnabled', true) || !channelSettingValue(state.activeChannel, 'popups.enabled', true)) {
    el.popupBar.hidden = true;
    renderPopupEditor();
    return;
  }
  el.popupBar.hidden = false;
  channelPopups(state.activeChannel).forEach((popup) => {
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

function channelPopups(channel) {
  const visibleLabels = parseLabelList(channelSettingValue(channel, 'popups.visibleLabels', ''));
  const order = parseLabelList(channelSettingValue(channel, 'popups.order', ''));
  const channelButtons = parseChannelPopupButtons(channelSettingValue(channel, 'popups.channelButtons', ''));
  let popups = [...state.settings.popups, ...channelButtons];
  if (visibleLabels.length > 0) {
    const allowed = new Set(visibleLabels.map((label) => label.toLowerCase()));
    popups = popups.filter((popup) => allowed.has(String(popup.label).toLowerCase()));
  }
  if (order.length > 0) {
    const rank = new Map(order.map((label, index) => [label.toLowerCase(), index]));
    popups.sort((a, b) => (rank.get(a.label.toLowerCase()) ?? 999) - (rank.get(b.label.toLowerCase()) ?? 999));
  }
  return popups;
}

function parseLabelList(value) {
  return String(value || '').split(',').map((entry) => entry.trim()).filter(Boolean);
}

function parseChannelPopupButtons(value) {
  return String(value || '').split(/\r?\n/).map((line) => {
    const [label, ...commandParts] = line.split('=');
    const command = commandParts.join('=').trim();
    return label?.trim() && command ? { label: label.trim(), command } : null;
  }).filter(Boolean);
}

function renderChatActions() {
  const channel = isServerTarget(state.activeChannel) ? '' : normalizeChannel(state.activeChannel);
  const canAutoJoin = Boolean(channel && !channelIsAutoJoined(channel));
  el.chatActionBar.hidden = !canAutoJoin;
  el.addAutoJoinCurrentButton.hidden = !canAutoJoin;
  if (canAutoJoin) el.addAutoJoinCurrentButton.textContent = `Add ${channel} to Auto Join`;
  updateComposerState(channel);
}

function updateComposerState(channel) {
  if (!el.messageInput || !el.inputForm) return;
  const canSend = state.connected && Boolean(channel);
  el.messageInput.disabled = !canSend;
  const submitButton = el.inputForm.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = !canSend;
  if (!state.connected) {
    el.messageInput.placeholder = 'Connect to start chatting...';
  } else if (!channel) {
    el.messageInput.placeholder = 'Select a channel to chat';
  } else {
    el.messageInput.placeholder = `Message ${channel}...`;
  }
}

function channelIsAutoJoined(channel) {
  const normalized = normalizeChannel(channel);
  return Boolean(
    channelSettingValue(normalized, 'autoJoin', false)
    || state.settings.connection.autoJoinChannels.some((entry) => normalizeChannel(entry) === normalized)
  );
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
  if (!timer.enabled || !state.connected || !channelTimersAllowed(timer.channel)) return;

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
    if (!channelTimersAllowed(current.channel)) return;
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

  const pills = channelSettingValue(state.activeChannel, 'timers.showNext', true) && channelTimersAllowed(state.activeChannel)
    ? timersForChannel(state.activeChannel).filter((timer) => timer.showOnChannel)
    : [];
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
  state.streamDetails.clear();
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
  loadGlobalTwitchEmotes();
  scheduleLivePolling();
}

function stripOauthPrefix(password) {
  return (password || '').replace(/^oauth:/i, '').trim();
}

function scheduleLivePolling() {
  stopLivePolling();
  if (!shouldPollLiveChannels()) {
    state.liveChannels.clear();
    state.streamDetails.clear();
    renderChannels();
    renderDashboard();
    return;
  }
  if (!state.connected || !state.twitchClientId) return;

  pollLiveChannels();
  state.livePollHandle = setInterval(pollLiveChannels, 60000);
}

function shouldPollLiveChannels() {
  return Boolean(
    state.settings.preferences.dashboardStreamStatus
    || state.settings.preferences.notifyOnLive
    || state.settings.preferences.moveLiveTabsToFront
  );
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
    const streams = data.data || [];
    const nowLive = new Set(streams.map((stream) => stream.user_login.toLowerCase()));
    state.streamDetails = new Map(streams.map((stream) => [stream.user_login.toLowerCase(), stream]));

    for (const login of nowLive) {
      const channel = `#${login}`;
      if ((state.settings.preferences.notifyOnLive || channelSettingValue(channel, 'notifications.goLive', false)) && !state.liveChannels.has(login)) {
        notifyChannelLive(login, streams.find((s) => s.user_login.toLowerCase() === login));
      }
      if (channelSettingValue(channel, 'stream.autoOpenWhenLive', false) && !state.settings.appearance.twitchPlayer) {
        openStreamForChannel(channel);
      }
    }
    state.liveChannels = nowLive;
    renderChannels();
    renderDashboard();
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
  const isActiveTarget = target === state.activeChannel;
  const shouldScroll = isActiveTarget ? chatIsAtBottom() : false;
  const role = event.roleKnown ? (event.role || '') : (event.role || rememberedUserRole(target, event.nick));
  const entry = {
    id: `${event.timestamp}-${Math.random().toString(36).slice(2)}`,
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
  renderDashboard();
  notifyChannelSpecificUser(entry);
  recordMentionIfNeeded(entry);
  if (!isActiveTarget) return;
  if (!shouldScroll) state.pendingNewMessages += 1;
  renderMessages({ forceScroll: shouldScroll });
}

const MAX_TRACKED_MENTIONS = 100;

function recordMentionIfNeeded(entry) {
  if (entry.direction !== 'in' || !messageMentionsNick(entry.text)) return;
  state.mentions = [
    { id: entry.id, channel: entry.target, nick: entry.nick, text: entry.text, timestamp: entry.timestamp },
    ...state.mentions,
  ].slice(0, MAX_TRACKED_MENTIONS);
  if (entry.target !== state.activeChannel) {
    state.mentionedChannels.add(entry.target);
    renderChannels();
  }
  renderMentionsButton();
  if (state.mentionsPanel.open) renderMentionsPanel();
}

function renderMentionsButton() {
  if (!el.mentionsButton) return;
  el.mentionsButton.hidden = state.mentions.length === 0;
  el.mentionsButton.classList.toggle('has-mentions', state.mentionedChannels.size > 0);
}

function setMentionsPanelOpen(open) {
  state.mentionsPanel.open = open;
  el.mentionsBackdrop.hidden = !open;
  if (open) renderMentionsPanel();
}

function renderMentionsPanel() {
  if (!el.mentionsList) return;
  el.mentionsList.innerHTML = '';
  if (state.mentions.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'mentions-empty';
    empty.textContent = 'No mentions yet.';
    el.mentionsList.append(empty);
    return;
  }
  state.mentions.forEach((mention) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'mentions-item';
    const meta = document.createElement('div');
    meta.className = 'mentions-item-meta';
    meta.append(
      document.createTextNode(`${mention.channel} • ${mention.nick}`),
      document.createTextNode(formatTime(mention.timestamp))
    );
    const text = document.createElement('div');
    text.className = 'mentions-item-text';
    text.textContent = mention.text;
    item.append(meta, text);
    item.addEventListener('click', () => jumpToMention(mention));
    el.mentionsList.append(item);
  });
}

function jumpToMention(mention) {
  setMentionsPanelOpen(false);
  if (mention.channel !== state.activeChannel) switchToChannel(mention.channel);
  requestAnimationFrame(() => {
    const row = el.messages.querySelector(`[data-message-id="${mention.id}"]`);
    if (!row) return;
    row.scrollIntoView({ block: 'center' });
    row.classList.add('jump-highlight');
    setTimeout(() => row.classList.remove('jump-highlight'), 1500);
  });
}

function clearMentions() {
  state.mentions = [];
  state.mentionedChannels.clear();
  renderMentionsButton();
  renderMentionsPanel();
  renderChannels();
}

function logMonitoredMessage(entry) {
  const monitor = state.monitored.get(entry.nick?.toLowerCase());
  if (!monitor || !monitor.logPath) return;
  window.macIRC.appendLog(monitor.logPath, formatLogLine(entry));
}

function logChannelMessage(target, entry) {
  const prefs = state.settings.preferences;
  if (!channelLogsEnabled(target)) return;
  const filename = (normalizeChannel(target) || 'server').replace(/^#/, '') || 'server';
  window.macIRC.appendLog(`${prefs.channelLogFolder}/${filename}.log`, formatLogLine(entry));
}

function channelLogsEnabled(channel) {
  const prefs = state.settings.preferences;
  return Boolean(prefs.channelLogging && prefs.channelLogFolder && channelSettingValue(channel, 'logs.enabled', true));
}

function notifyOnMention(event) {
  if (event.direction !== 'in') return;
  const channelMentions = channelSettingValue(event.target, 'notifications.mentions', false);
  if (!state.settings.preferences.notifyOnMention && !channelMentions) return;
  if (!messageMentionsNick(event.text)) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification(`${event.nick} mentioned you`, { body: event.text });
}

function notifyChannelSpecificUser(entry) {
  if (entry.direction !== 'in') return;
  const users = parseLabelList(channelSettingValue(entry.target, 'notifications.specificUsers', '')).map((nick) => nick.toLowerCase());
  if (!users.includes(String(entry.nick || '').toLowerCase())) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification(`${entry.nick} chatted in ${entry.target}`, { body: entry.text });
}

function renderMessages({ forceScroll = false } = {}) {
  const shouldScroll = forceScroll || chatIsAtBottom();
  el.messages.innerHTML = '';
  const density = chatDisplayValue('density', 'comfortable');
  const compact = density === 'compact' || channelSettingValue(state.activeChannel, 'chat.compactMode', false);
  el.messages.dataset.density = density;
  el.messages.classList.toggle('compact-messages', compact);
  el.messages.style.fontSize = `${channelSettingValue(state.activeChannel, 'chat.fontSize', chatDisplayValue('fontSize', 13))}px`;
  const messages = state.messagesByTarget.get(state.activeChannel) || [];
  let visibleMessageCount = 0;
  const repeated = new Set();
  let previousMessage = null;
  messages.forEach((entry) => {
    if (entry.kind === 'message' && isHidden(entry.nick || '')) return;
    if (entry.kind === 'message' && channelSettingValue(state.activeChannel, 'chat.hideBotMessages', false) && looksLikeBot(entry.nick)) return;
    if (entry.kind === 'message' && channelSettingValue(state.activeChannel, 'chat.hideRepeatedMessages', false)) {
      const repeatKey = `${entry.nick?.toLowerCase()}::${entry.text}`;
      if (repeated.has(repeatKey)) return;
      repeated.add(repeatKey);
    }
    if (entry.kind === 'status') {
      if (!chatDisplayValue('showSystemMessages', true)) return;
      renderStatusRow(entry);
    } else {
      renderMessageRow(entry, previousMessage);
      previousMessage = entry;
      visibleMessageCount += 1;
    }
  });
  renderChatEmptyState(visibleMessageCount);
  renderChannelStatusStrip();
  if (shouldScroll) {
    state.pendingNewMessages = 0;
    el.messages.scrollTop = el.messages.scrollHeight;
  }
  renderNewMessagesButton();
}

function chatDisplayValue(key, fallback) {
  return state.settings?.preferences?.chatDisplay?.[key] ?? fallback;
}

function chatIsAtBottom() {
  if (!el.messages) return true;
  return el.messages.scrollHeight - el.messages.scrollTop - el.messages.clientHeight < 56;
}

function renderNewMessagesButton() {
  if (!el.newMessagesButton) return;
  const count = state.pendingNewMessages;
  el.newMessagesButton.hidden = count <= 0;
  el.newMessagesButton.textContent = count === 1 ? '1 new message' : `${count} new messages`;
}

function renderChatEmptyState(visibleMessageCount) {
  if (state.activeChannel === 'server' || visibleMessageCount >= 3) return;
  const empty = document.createElement('div');
  empty.className = 'chat-empty-state';
  const title = document.createElement('div');
  title.className = 'chat-empty-state-title';
  const hint = document.createElement('div');
  hint.className = 'chat-empty-state-hint';
  if (!state.activeChannel) {
    title.textContent = 'No channel selected';
    hint.textContent = 'Choose a channel on the left to view stream and chat.';
  } else {
    title.textContent = 'No messages yet';
    hint.textContent = `Say hello to start the chat in ${state.activeChannel}.`;
  }
  empty.append(title, hint);
  el.messages.append(empty);
}

function renderMessageRow(event, previousMessage = null) {
  const row = document.createElement('div');
  const channel = event.target || state.activeChannel;
  const showTimestamps = channelSettingValue(channel, 'chat.showTimestamps', chatDisplayValue('showTimestamps', true));
  const showBadges = channelSettingValue(channel, 'chat.showBadges', chatDisplayValue('showBadges', true));
  const highlightMentions = channelSettingValue(channel, 'chat.highlightMentions', chatDisplayValue('highlightMentions', true));
  const groupMessages = chatDisplayValue('groupMessages', false);
  const grouped = Boolean(groupMessages
    && previousMessage
    && previousMessage.kind === 'message'
    && previousMessage.nick === event.nick
    && previousMessage.direction === event.direction
    && Math.abs((event.timestamp || 0) - (previousMessage.timestamp || 0)) < 120000);
  const isMention = event.direction === 'in' && highlightMentions && messageMentionsNick(event.text);
  const highlightedUsers = parseLabelList(channelSettingValue(channel, 'chat.highlightUsers', '')).map((nick) => nick.toLowerCase());
  const isHighlightedUser = highlightedUsers.includes(String(event.nick || '').toLowerCase());
  const isFirstTime = channelSettingValue(channel, 'chat.highlightFirstTimeChatters', false)
    && getUserStats(channel, event.nick).messageCount <= 1;
  row.className = `message ${event.direction || ''}${isMention ? ' mention' : ''}${isMonitored(event.nick || '') ? ' monitored' : ''}${isHighlightedUser ? ' highlighted-user' : ''}${isFirstTime ? ' first-time' : ''}${showTimestamps ? '' : ' no-time'}${grouped ? ' grouped' : ''}`;
  if (event.id) row.dataset.messageId = event.id;
  const time = document.createElement('span');
  time.className = 'time';
  time.textContent = grouped ? '' : formatTime(event.timestamp);
  const nick = document.createElement('span');
  nick.className = `nick${event.role ? ` ${event.role}` : ''}`;
  if (!grouped && showBadges) appendRoleIcon(nick, event.role);
  nick.append(document.createTextNode(grouped ? '' : event.nick));
  nick.addEventListener('click', () => {
    openUserDrawer(channel, event.nick);
  });
  nick.addEventListener('contextmenu', (contextEvent) => {
    contextEvent.preventDefault();
    showMessageUserContextMenu(contextEvent, event);
  });
  const text = document.createElement('span');
  text.className = 'text';
  renderMessageText(text, event.text, channel, event.twitchEmotes);
  if (showTimestamps) row.append(time);
  row.append(nick, text);
  if (chatDisplayValue('hoverActions', true)) row.append(createMessageActions(event));
  el.messages.append(row);
}

function createMessageActions(event) {
  const actions = document.createElement('span');
  actions.className = 'message-actions';
  actions.append(
    messageActionButton('Mention', () => mentionUserFromChat(event.nick)),
    messageActionButton('Copy', () => copyText(event.text || '')),
    messageActionButton('Profile', () => openUserDrawer(event.target || state.activeChannel, event.nick))
  );
  if (chatDisplayValue('hoverModTools', true) && canModerateChannel(event.target || state.activeChannel) && event.direction === 'in') {
    actions.append(
      messageActionButton('Timeout', () => runInputForTarget(`/timeout ${event.nick} 600`, event.target || state.activeChannel)),
      messageActionButton('Ban', () => runInputForTarget(`/ban ${event.nick}`, event.target || state.activeChannel))
    );
  }
  return actions;
}

function messageActionButton(label, action) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    action();
  });
  return button;
}

function mentionUserFromChat(nick) {
  const current = el.messageInput.value;
  el.messageInput.value = `${current}${current && !current.endsWith(' ') ? ' ' : ''}@${nick} `;
  el.messageInput.focus();
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    appendStatus('Could not copy to clipboard.', 'error');
  }
}

function showMessageUserContextMenu(event, chatEvent) {
  hideContextMenu();
  const channel = chatEvent.target || state.activeChannel;
  const nick = chatEvent.nick;
  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.append(
    contextMenuButton(`Mention ${nick}`, () => mentionUserFromChat(nick)),
    contextMenuButton('Copy username', () => copyText(nick)),
    contextMenuButton('Copy message', () => copyText(chatEvent.text || '')),
    contextMenuButton('Open profile', () => openUserDrawer(channel, nick))
  );
  if (chatDisplayValue('hoverModTools', true) && canModerateChannel(channel) && chatEvent.direction === 'in') {
    menu.append(
      contextMenuButton('Timeout 10 minutes', () => runInputForTarget(`/timeout ${nick} 600`, channel)),
      contextMenuButton('Ban user', () => runInputForTarget(`/ban ${nick}`, channel))
    );
  }
  document.body.append(menu);
  positionContextMenu(menu, event.clientX, event.clientY);
  state.activeContextMenu = menu;
}

function contextMenuButton(label, action) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.addEventListener('click', () => {
    hideContextMenu();
    action();
  });
  return button;
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
  row.className = `message status ${entry.level || 'info'}`;
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
  state.mentionedChannels.delete(normalized);
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
  renderDashboard();
}

function addRosterUser(channel, nick, role = '', options = {}) {
  const normalized = normalizeChannel(channel);
  if (!normalized || !nick) return;
  if (options.roleKnown) rememberUserRole(normalized, nick, role);
  setRosterUser(normalized, rosterFor(normalized), nick, role, options);
  rememberChatter(nick);
  if (normalized === state.activeChannel) renderRoster();
  renderDashboard();
}

function removeRosterUser(channel, nick) {
  const normalized = normalizeChannel(channel);
  if (!normalized || !nick) return;
  const roster = state.rosters.get(normalized);
  if (!roster) return;
  roster.delete(nick.toLowerCase());
  if (normalized === state.activeChannel) renderRoster();
  renderDashboard();
}

function removeRosterUserFromAllChannels(nick) {
  if (!nick) return;
  for (const [channel, roster] of state.rosters.entries()) {
    roster.delete(nick.toLowerCase());
    if (channel === state.activeChannel) renderRoster();
  }
  renderDashboard();
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
    badges: options.badges ?? existing?.badges ?? '',
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
  return state.rosters.get(channel)?.get(nick.toLowerCase()) || { nick, role: '', badges: '' };
}

// --- User profile drawer ---

function recordUserMessage(channel, nick, text, timestamp) {
  const normalized = normalizeChannel(channel);
  if (!normalized || !nick) return;
  if (!state.userStats.has(normalized)) state.userStats.set(normalized, new Map());
  const channelStats = state.userStats.get(normalized);
  const key = nick.toLowerCase();
  const stamp = timestamp || Date.now();
  const existing = channelStats.get(key) || { messageCount: 0, firstSeenAt: stamp, lastMessageAt: stamp, recentMessages: [] };
  existing.messageCount += 1;
  existing.lastMessageAt = stamp;
  existing.recentMessages = [...existing.recentMessages, { text, timestamp: stamp }].slice(-5);
  channelStats.set(key, existing);

  if (state.userDrawer.open && state.userDrawer.channel === normalized && state.userDrawer.nick.toLowerCase() === key) {
    renderUserDrawer();
  }
}

function getUserStats(channel, nick) {
  const normalized = normalizeChannel(channel);
  return state.userStats.get(normalized)?.get((nick || '').toLowerCase())
    || { messageCount: 0, firstSeenAt: null, lastMessageAt: null, recentMessages: [] };
}

const KNOWN_BOT_NICKS = ['nightbot', 'streamelements', 'streamlabs', 'moobot', 'fossabot', 'wizebot', 'own3d', 'sery_bot', 'creatisbot'];

function looksLikeBot(nick) {
  const lower = (nick || '').toLowerCase();
  return KNOWN_BOT_NICKS.includes(lower) || lower.endsWith('bot');
}

function parseBadgeList(badgesRaw, nick) {
  const names = (badgesRaw || '').split(',').map((badge) => badge.split('/')[0]).filter(Boolean);
  const labels = [];
  if (names.includes('broadcaster')) labels.push('Broadcaster');
  if (names.some((name) => ['moderator', 'global_mod', 'admin', 'staff'].includes(name))) labels.push('Mod');
  if (names.includes('vip')) labels.push('VIP');
  if (names.some((name) => name === 'subscriber' || name === 'founder')) labels.push('Subscriber');
  if (looksLikeBot(nick)) labels.push('Bot');
  return labels;
}

function canModerateChannel(channel) {
  const self = getRosterUser(normalizeChannel(channel), state.settings.profile.nick || '');
  return self?.role === 'mod';
}

function openUserDrawer(channel, nick) {
  if (!nick) return;
  state.userDrawer = { open: true, channel: normalizeChannel(channel) || state.activeChannel, nick };
  el.userDrawer.classList.add('is-open');
  renderUserDrawer();
}

function closeUserDrawer() {
  state.userDrawer.open = false;
  el.userDrawer.classList.remove('is-open');
}

function renderUserDrawer() {
  if (!state.userDrawer.open) return;
  const { channel, nick } = state.userDrawer;
  const key = nick.toLowerCase();
  const rosterUser = getRosterUser(channel, nick);

  el.userDrawerName.textContent = key;
  el.userDrawerDisplayName.textContent = nick !== key ? nick : '';

  el.userDrawerBadges.innerHTML = '';
  const badges = parseBadgeList(rosterUser.badges, nick);
  if (badges.length === 0) {
    const span = document.createElement('span');
    span.className = 'user-drawer-badge';
    span.textContent = 'No roles';
    el.userDrawerBadges.append(span);
  } else {
    badges.forEach((label) => {
      const span = document.createElement('span');
      span.className = `user-drawer-badge ${label.toLowerCase()}`;
      span.textContent = label;
      el.userDrawerBadges.append(span);
    });
  }

  const stats = getUserStats(channel, nick);
  el.userDrawerMessageCount.textContent = String(stats.messageCount);
  el.userDrawerFirstSeen.textContent = stats.firstSeenAt ? formatTime(stats.firstSeenAt) : '—';
  el.userDrawerLastMessage.textContent = stats.lastMessageAt ? formatTime(stats.lastMessageAt) : '—';

  el.userDrawerRecentMessages.innerHTML = '';
  if (stats.recentMessages.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'user-drawer-empty';
    empty.textContent = 'No messages yet this session.';
    el.userDrawerRecentMessages.append(empty);
  } else {
    stats.recentMessages.slice().reverse().forEach((entry) => {
      const row = document.createElement('div');
      row.className = 'user-drawer-message';
      const time = document.createElement('span');
      time.className = 'time';
      time.textContent = formatTime(entry.timestamp);
      const text = document.createElement('span');
      text.className = 'text';
      text.textContent = entry.text;
      row.append(time, text);
      el.userDrawerRecentMessages.append(row);
    });
  }

  el.userDrawerNote.value = state.settings.preferences.userNotes[key] || '';

  const moderationAllowed = canModerateChannel(channel) && channelSettingValue(channel, 'moderation.enabled', true);
  const showTimeoutBan = channelSettingValue(channel, 'moderation.showTimeoutBan', true);
  [el.userDrawerTimeout, el.userDrawerBan, el.userDrawerUnban].forEach((button) => {
    button.hidden = !showTimeoutBan;
    button.disabled = !moderationAllowed;
    button.title = moderationAllowed ? '' : 'Requires moderator permissions.';
  });
  el.userDrawerWhisper.disabled = true;
  el.userDrawerWhisper.title = 'Twitch removed whisper support over IRC.';
}

function clearUserMessagesLocally(channel, nick) {
  const normalized = normalizeChannel(channel);
  const messages = state.messagesByTarget.get(normalized);
  if (!messages) return;
  const key = nick.toLowerCase();
  state.messagesByTarget.set(
    normalized,
    messages.filter((entry) => !(entry.kind === 'message' && (entry.nick || '').toLowerCase() === key))
  );
  if (normalized === state.activeChannel) renderMessages();
  appendStatus(`Cleared ${nick}'s messages from ${normalized} (local view only).`, 'info');
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

function twitchHelixEmoteUrl(emote) {
  if (emote.images?.url_4x || emote.images?.url_2x || emote.images?.url_1x) {
    return emote.images.url_4x || emote.images.url_2x || emote.images.url_1x;
  }
  return `https://static-cdn.jtvnw.net/emoticons/v2/${encodeURIComponent(emote.id)}/default/dark/2.0`;
}

async function loadGlobalTwitchEmotes() {
  if (state.twitchEmotes.global || !state.twitchClientId) return;
  const token = stripOauthPrefix(state.settings.profile.password);
  if (!token) return;
  try {
    const result = await window.macIRC.getTwitchEmotes({ token, clientId: state.twitchClientId });
    if (!result.ok) return;
    const emotes = new Map();
    for (const emote of result.data?.data || []) {
      const url = twitchHelixEmoteUrl(emote);
      if (emote.name && url) emotes.set(emote.name, url);
    }
    state.twitchEmotes.global = emotes;
    if (state.emotePicker.open) renderEmotePickerGrid();
  } catch {
    // global Twitch emotes are a nice-to-have for the picker; ignore failures
  }
}

async function loadTwitchChannelEmotes(channel, roomId) {
  const normalized = normalizeChannel(channel);
  const token = stripOauthPrefix(state.settings.profile.password);
  if (!normalized || !roomId || !token || !state.twitchClientId) return;
  if (state.twitchEmotes.byChannel.has(normalized) || state.twitchEmotes.loadingChannels.has(normalized)) return;

  state.twitchEmotes.loadingChannels.add(normalized);
  try {
    const result = await window.macIRC.getTwitchEmotes({
      token,
      clientId: state.twitchClientId,
      broadcasterId: roomId,
    });
    if (!result.ok) {
      state.twitchEmotes.byChannel.set(normalized, new Map());
      return;
    }
    const emotes = new Map();
    for (const emote of result.data?.data || []) {
      const url = twitchHelixEmoteUrl(emote);
      if (emote.name && url) emotes.set(emote.name, url);
    }
    state.twitchEmotes.byChannel.set(normalized, emotes);
    if (state.emotePicker.open && normalized === state.activeChannel) renderEmotePickerGrid();
  } catch {
    state.twitchEmotes.byChannel.set(normalized, new Map());
  } finally {
    state.twitchEmotes.loadingChannels.delete(normalized);
  }
}

function emotePickerGroups() {
  const orderedChannels = uniqueChannels([state.activeChannel, ...state.channels])
    .filter((channel) => !isServerTarget(channel));

  if (state.emotePicker.source === '7tv') {
    return orderedChannels
      .map((channel) => ({ label: channel.replace(/^#/, ''), emotes: state.sevenTv.emotesByChannel.get(channel) }))
      .filter((group) => group.emotes && group.emotes.size > 0);
  }

  const groups = orderedChannels.map((channel) => (
    { label: channel.replace(/^#/, ''), emotes: state.twitchEmotes.byChannel.get(channel) }
  ));
  groups.push({ label: 'Global', emotes: state.twitchEmotes.global });
  return groups.filter((group) => group.emotes && group.emotes.size > 0);
}

function renderEmotePickerGrid() {
  if (!el.emotePickerGrid) return;
  el.emotePickerGrid.innerHTML = '';
  const search = state.emotePicker.search.trim().toLowerCase();
  const groups = emotePickerGroups()
    .map((group) => ({
      label: group.label,
      entries: Array.from(group.emotes.entries())
        .filter(([name]) => !search || name.toLowerCase().includes(search))
        .sort(([a], [b]) => a.localeCompare(b)),
    }))
    .filter((group) => group.entries.length > 0);

  if (groups.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'emote-picker-empty';
    empty.textContent = 'No emotes found.';
    el.emotePickerGrid.append(empty);
    return;
  }

  groups.forEach((group) => {
    const label = document.createElement('div');
    label.className = 'emote-picker-group-label';
    label.textContent = group.label;
    el.emotePickerGrid.append(label);

    const grid = document.createElement('div');
    grid.className = 'emote-picker-group-grid';
    group.entries.forEach(([name, url]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'emote-picker-item';
      button.title = name;
      const img = document.createElement('img');
      img.src = url;
      img.alt = name;
      img.loading = 'lazy';
      button.append(img);
      button.addEventListener('click', () => insertEmoteIntoComposer(name));
      grid.append(button);
    });
    el.emotePickerGrid.append(grid);
  });
}

function insertEmoteIntoComposer(name) {
  const input = el.messageInput;
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  const needsLeadingSpace = start > 0 && !/\s$/.test(input.value.slice(0, start));
  const insertion = `${needsLeadingSpace ? ' ' : ''}${name} `;
  input.value = `${input.value.slice(0, start)}${insertion}${input.value.slice(end)}`;
  const cursor = start + insertion.length;
  input.setSelectionRange(cursor, cursor);
  input.focus();
}

function setEmotePickerOpen(open) {
  state.emotePicker.open = open;
  el.emotePicker.hidden = !open;
  el.emoteButton.classList.toggle('is-active', open);
  if (open) renderEmotePickerGrid();
}

function setEmotePickerSource(source) {
  state.emotePicker.source = source;
  el.emotePickerTabs.forEach((tab) => {
    tab.classList.toggle('is-active', tab.dataset.emoteSource === source);
  });
  renderEmotePickerGrid();
}

function renderMessageText(container, text, channel, twitchEmotes = []) {
  if (!chatDisplayValue('showEmotes', true) || !channelSettingValue(channel, 'chat.showEmotes', true)) {
    appendLinkedText(container, String(text || ''));
    return;
  }

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
