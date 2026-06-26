const { app, BrowserWindow, ipcMain, Menu, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const http = require('http');
const { spawn } = require('child_process');
const Store = require('electron-store');
const { IrcManager } = require('./services/irc-manager');

app.setName('ClovaChat');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

function startLocalServer() {
  const root = path.join(__dirname, '../..');
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const requestPath = decodeURIComponent(req.url.split('?')[0]);
      const filePath = path.normalize(path.join(root, requestPath));
      if (!filePath.startsWith(root)) {
        res.writeHead(403);
        res.end();
        return;
      }
      fs.readFile(filePath, (error, data) => {
        if (error) {
          res.writeHead(404);
          res.end();
          return;
        }
        const ext = path.extname(filePath);
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
    server.on('error', reject);
  });
}

const store = new Store({
  defaults: {
    profile: {
      nick: 'ClovaChatUser',
      username: 'clovachat',
      realName: 'ClovaChat User',
      password: '',
    },
    quickConnect: {
      host: 'irc.chat.twitch.tv',
      port: 6697,
      tls: true,
      channel: '#twitch',
    },
    appearance: {
      theme: 'light',
      sevenTvEmotes: true,
      twitchPlayer: false,
      twitchPlayerWidth: 420
    },
    connection: {
      connectOnOpen: false,
      autoJoinChannels: []
    },
    aliases: [
      { name: 'hello', output: 'Hello from ClovaChat.' },
      { name: 'lurk', output: 'I am lurking for a bit.' }
    ],
    botRules: [],
    timedMessages: [],
    popups: [
      { label: 'Wave', command: '👋' },
      { label: 'Say hello', command: 'Hello' },
      { label: 'Leave channel', command: '/part $channel' }
    ],
    preferences: {
      chatHistoryEnabled: true,
      channelLogging: false,
      channelLogFolder: '',
      notifyOnMention: false,
      roleMemory: {},
    }
  }
});

const historyStore = new Store({ name: 'chat-history', defaults: { history: {} } });

let mainWindow;
const irc = new IrcManager({
  onEvent: (event) => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('irc:event', event);
    }
  }
});

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1180,
    height: 760,
    minWidth: 920,
    minHeight: 620,
    title: 'ClovaChat',
    backgroundColor: '#f4f2ec',
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  Menu.setApplicationMenu(buildMenu());

  const server = await startLocalServer();
  const { port } = server.address();
  mainWindow.on('closed', () => server.close());
  mainWindow.loadURL(`http://localhost:${port}/src/renderer/index.html`);
}

function buildMenu() {
  return Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    }
  ]);
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  irc.disconnect();
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('settings:get', () => store.store);

ipcMain.handle('settings:set', (_event, nextSettings) => {
  store.set(nextSettings);
  return store.store;
});

ipcMain.handle('external:open', (_event, url) => {
  const allowedUrls = new Set([
    'https://twitchtokengenerator.com/',
    'https://dev.twitch.tv/docs/chat/irc/'
  ]);

  if (!allowedUrls.has(url)) {
    return { ok: false };
  }

  shell.openExternal(url);
  return { ok: true };
});

ipcMain.handle('irc:connect', (_event, config) => irc.connect(config));
ipcMain.handle('irc:disconnect', () => irc.disconnect());
ipcMain.handle('irc:send', (_event, payload) => irc.send(payload));

ipcMain.handle('python:command', async (_event, payload = {}) => runPythonCommand(payload));

ipcMain.handle('twitch:getChatters', async (_event, payload = {}) => {
  const token = String(payload.token || '').trim();
  const clientId = String(payload.clientId || '').trim();
  const broadcasterId = String(payload.broadcasterId || '').trim();
  const moderatorId = String(payload.moderatorId || '').trim();
  const after = String(payload.after || '').trim();

  if (!token || !clientId || !broadcasterId || !moderatorId) {
    return { ok: false, status: 400, error: 'Missing Twitch roster credentials.' };
  }

  const params = new URLSearchParams({
    broadcaster_id: broadcasterId,
    moderator_id: moderatorId,
    first: '1000',
  });
  if (after) params.set('after', after);

  try {
    const response = await fetch(`https://api.twitch.tv/helix/chat/chatters?${params.toString()}`, {
      headers: {
        'Client-Id': clientId,
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: data.message || `Twitch returned ${response.status}`,
      };
    }
    return { ok: true, status: response.status, data };
  } catch (error) {
    return { ok: false, status: 0, error: error.message };
  }
});

ipcMain.handle('log:chooseFile', async (_event, suggestedName) => {
  if (!mainWindow) return { ok: false };
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Save monitor log file',
    defaultPath: suggestedName,
    filters: [{ name: 'Text Log', extensions: ['log', 'txt'] }],
  });
  if (result.canceled || !result.filePath) return { ok: false };
  return { ok: true, path: result.filePath };
});

ipcMain.handle('log:append', (_event, { path: filePath, content }) => {
  try {
    fs.appendFileSync(filePath, content);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});

ipcMain.handle('log:chooseFolder', async () => {
  if (!mainWindow) return { ok: false };
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Choose channel log folder',
    properties: ['openDirectory', 'createDirectory'],
  });
  if (result.canceled || !result.filePaths[0]) return { ok: false };
  return { ok: true, path: result.filePaths[0] };
});

ipcMain.handle('history:get', () => historyStore.get('history'));

ipcMain.handle('history:set', (_event, history) => {
  historyStore.set('history', history);
  return { ok: true };
});

ipcMain.handle('history:clear', () => {
  historyStore.set('history', {});
  return { ok: true };
});

ipcMain.handle('settings:export', async () => {
  if (!mainWindow) return { ok: false };
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Backup ClovaChat settings',
    defaultPath: 'clovachat-settings.json',
    filters: [{ name: 'JSON', extensions: ['json'] }],
  });
  if (result.canceled || !result.filePath) return { ok: false };
  fs.writeFileSync(result.filePath, JSON.stringify(store.store, null, 2));
  return { ok: true, path: result.filePath };
});

ipcMain.handle('settings:import', async () => {
  if (!mainWindow) return { ok: false };
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Import ClovaChat settings',
    properties: ['openFile'],
    filters: [{ name: 'JSON', extensions: ['json'] }],
  });
  if (result.canceled || !result.filePaths[0]) return { ok: false };
  try {
    const data = JSON.parse(fs.readFileSync(result.filePaths[0], 'utf8'));
    store.set(data);
    return { ok: true, settings: store.store };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});

ipcMain.handle('app:getVersion', () => app.getVersion());

function runPythonCommand(payload) {
  return new Promise((resolve) => {
    const script = String(payload.script || '');
    const context = {
      args: Array.isArray(payload.args) ? payload.args.map(String) : [],
      arg_text: String(payload.argText || ''),
      channel: String(payload.channel || ''),
      nick: String(payload.nick || ''),
      user: String(payload.user || ''),
      message: String(payload.message || ''),
      trigger: String(payload.trigger || ''),
    };
    const wrapper = [
      'import json, sys',
      'context = json.loads(sys.stdin.read() or "{}")',
      'args = context.get("args", [])',
      'arg_text = context.get("arg_text", "")',
      'channel = context.get("channel", "")',
      'nick = context.get("nick", "")',
      'user = context.get("user", "")',
      'message = context.get("message", "")',
      'trigger = context.get("trigger", "")',
      'def send(value):',
      '    print(value)',
      'exec(compile(context.get("script", ""), "<clovachat-command>", "exec"), globals())',
    ].join('\n');
    const child = spawn('python3', ['-c', wrapper], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
    });
    let stdout = '';
    let stderr = '';
    const timeout = setTimeout(() => {
      child.kill('SIGKILL');
      resolve({ ok: false, error: 'Python command timed out.' });
    }, 5000);

    child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk) => { stderr += chunk.toString(); });
    child.on('error', (error) => {
      clearTimeout(timeout);
      resolve({ ok: false, error: error.message });
    });
    child.on('close', (code) => {
      clearTimeout(timeout);
      if (code !== 0) {
        resolve({ ok: false, error: stderr.trim() || `Python exited with code ${code}.` });
        return;
      }
      resolve({ ok: true, output: stdout });
    });
    child.stdin.end(JSON.stringify({ ...context, script }));
  });
}
