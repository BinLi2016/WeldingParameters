const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'welding-machine.png'),
    title: '焊接参数管理器'
  });

  mainWindow.loadFile('index.html');

  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function getDefaultConfigPath() {
  if (app.isPackaged) {
    const exePath = process.execPath;
    const exeDir = path.dirname(exePath);
    return path.join(exeDir, 'welding_config.json');
  } else {
    return path.join(__dirname, 'welding_config.json');
  }
}

ipcMain.handle('load-config', async () => {
  try {
    const defaultConfigPath = getDefaultConfigPath();
    const data = fs.readFileSync(defaultConfigPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading config:', error);
    return null;
  }
});

ipcMain.handle('save-config', async (event, config) => {
  try {
    const defaultConfigPath = getDefaultConfigPath();
    fs.writeFileSync(defaultConfigPath, JSON.stringify(config, null, 4), 'utf8');
    return { success: true };
  } catch (error) {
    console.error('Error saving config:', error);
    return { success: false, error: error.message };
  }
});
