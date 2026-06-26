const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('macIRC', {
  getSettings: () => ipcRenderer.invoke('settings:get'),
  setSettings: (settings) => ipcRenderer.invoke('settings:set', settings),
  openExternal: (url) => ipcRenderer.invoke('external:open', url),
  connect: (config) => ipcRenderer.invoke('irc:connect', config),
  disconnect: () => ipcRenderer.invoke('irc:disconnect'),
  send: (payload) => ipcRenderer.invoke('irc:send', payload),
  runPythonCommand: (payload) => ipcRenderer.invoke('python:command', payload),
  getTwitchChatters: (payload) => ipcRenderer.invoke('twitch:getChatters', payload),
  chooseLogFile: (suggestedName) => ipcRenderer.invoke('log:chooseFile', suggestedName),
  chooseLogFolder: () => ipcRenderer.invoke('log:chooseFolder'),
  appendLog: (path, content) => ipcRenderer.invoke('log:append', { path, content }),
  getHistory: () => ipcRenderer.invoke('history:get'),
  setHistory: (history) => ipcRenderer.invoke('history:set', history),
  clearHistory: () => ipcRenderer.invoke('history:clear'),
  exportSettings: () => ipcRenderer.invoke('settings:export'),
  importSettings: () => ipcRenderer.invoke('settings:import'),
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  checkForUpdates: () => ipcRenderer.invoke('updates:check'),
  downloadAndInstallUpdate: (asset) => ipcRenderer.invoke('updates:downloadAndInstall', asset),
  onIrcEvent: (callback) => {
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on('irc:event', listener);
    return () => ipcRenderer.removeListener('irc:event', listener);
  }
});
