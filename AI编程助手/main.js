const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

const CONFIG_PATH = path.join(app.getPath('userData'), 'config.json');

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    }
  } catch (e) { /* ignore */ }
  return {};
}

function saveConfigToFile(data) {
  const config = loadConfig();
  Object.assign(config, data);
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    minWidth: 600,
    minHeight: 400,
    title: 'AI编程助手',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  mainWindow.setMenuBarVisibility(false);
}

// IPC handlers
ipcMain.handle('save-config', (event, key, value) => {
  saveConfigToFile({ [key]: value });
  return true;
});

ipcMain.handle('get-config', (event, key) => {
  const config = loadConfig();
  return config[key] || '';
});

ipcMain.handle('ai-chat', async (event, messages, apiKey, model) => {
  const modelName = model || 'deepseek-chat';
  const url = 'https://api.deepseek.com/chat/completions';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: messages,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { error: `API错误 (${response.status}): ${errorText}` };
    }

    const data = await response.json();
    return { text: data.choices[0].message.content };
  } catch (e) {
    return { error: `网络错误: ${e.message}. 请检查网络连接` };
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
