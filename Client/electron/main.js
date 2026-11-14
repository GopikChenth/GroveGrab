const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { spawn } = require('child_process');
const path = require('path');

let mainWindow;
let backendProcess;

function startBackend() {
  const isProd = app.isPackaged;
  const backendDir = isProd
    ? path.join(process.resourcesPath, 'backend')
    : path.join(__dirname, '..', '..', 'Backend');

  const pythonExecutable = isProd
    ? path.join(process.resourcesPath, 'python', 'python.exe')
    : (process.platform === 'win32' ? 'python' : 'python3');

  const backendScript = path.join(backendDir, 'app.py');

  backendProcess = spawn(pythonExecutable, [backendScript], {
    cwd: backendDir,
    env: { ...process.env, PYTHONUNBUFFERED: '1' }
  });

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend process:', err);
    backendProcess = null;
  });

  backendProcess.on('close', (code) => {
    backendProcess = null;
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '..', 'public', '1.png')
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  } else {
    mainWindow.loadURL('http://localhost:5173');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startBackend();
  setTimeout(createWindow, 1500);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});
