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

// Get the user data directory for saving configuration
function getUserConfigPath() {
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, 'welding_config.json');
}

// Get the default config path (from app resources)
function getDefaultConfigPath() {
  return path.join(__dirname, 'welding_config.json');
}

// IPC handlers for file operations
ipcMain.handle('load-config', async () => {
  try {
    // First try to load from user data directory
    const userConfigPath = getUserConfigPath();
    if (fs.existsSync(userConfigPath)) {
      const data = fs.readFileSync(userConfigPath, 'utf8');
      return JSON.parse(data);
    }
    
    // If user config doesn't exist, load from default config
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
    // Save to user data directory
    const userConfigPath = getUserConfigPath();
    
    // Ensure the directory exists
    const userDataDir = path.dirname(userConfigPath);
    if (!fs.existsSync(userDataDir)) {
      fs.mkdirSync(userDataDir, { recursive: true });
    }
    
    fs.writeFileSync(userConfigPath, JSON.stringify(config, null, 4), 'utf8');
    return { success: true };
  } catch (error) {
    console.error('Error saving config:', error);
    return { success: false, error: error.message };
  }
});