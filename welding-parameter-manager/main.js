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
    icon: path.join(__dirname, 'welding-machine.png'), // Custom welding machine icon
    title: '焊接参数管理器'
  });

  mainWindow.loadFile('index.html');

  // Open DevTools in development
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

// Get the config path from the executable's directory
function getDefaultConfigPath() {
  // In production, use the executable's directory
  // In development, use the current directory
  if (app.isPackaged) {
    // Get the directory where the exe is located
    const exePath = process.execPath;
    const exeDir = path.dirname(exePath);
    return path.join(exeDir, 'welding_config.json');
  } else {
    // Development mode - use current directory
    return path.join(__dirname, 'welding_config.json');
  }
}

// IPC handlers for file operations
// Config file is loaded from and saved to the same directory as the executable
// This makes the app portable - users can run it from any folder with their config
ipcMain.handle('load-config', async () => {
  try {
    // Always load from default config path
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
    // Always save to default config path
    const defaultConfigPath = getDefaultConfigPath();
    
    fs.writeFileSync(defaultConfigPath, JSON.stringify(config, null, 4), 'utf8');
    return { success: true };
  } catch (error) {
    console.error('Error saving config:', error);
    return { success: false, error: error.message };
  }
});