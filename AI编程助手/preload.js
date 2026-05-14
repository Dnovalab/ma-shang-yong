const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('aiAPI', {
  // Save data to local file
  saveConfig: (key, value) => ipcRenderer.invoke('save-config', key, value),
  getConfig: (key) => ipcRenderer.invoke('get-config', key),

  // Call AI API
  chat: (messages, apiKey, model) => ipcRenderer.invoke('ai-chat', messages, apiKey, model),

  // App info
  platform: process.platform,
  version: '1.0.0'
});
