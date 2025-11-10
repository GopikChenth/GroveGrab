const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const express = require('express');
const axios = require('axios');

let mainWindow;
let backendProcess;
let frontendServer;

const BACKEND_PORT = 5000;
const FRONTEND_PORT = 5173;

// Check if port is available
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = require('net').createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

// Kill process on port
function killPort(port) {
  return new Promise((resolve) => {
    if (process.platform === 'win32') {
      spawn('taskkill', ['/F', '/IM', 'python.exe'], { shell: true });
      setTimeout(resolve, 1000);
    } else {
      spawn('lsof', [`-ti:${port}`]).stdout.on('data', (data) => {
        const pid = data.toString().trim();
        if (pid) spawn('kill', ['-9', pid]);
      });
      setTimeout(resolve, 1000);
    }
  });
}

// Start Flask backend
async function startBackend() {
  return new Promise(async (resolve, reject) => {
    const backendPath = path.join(__dirname, '..', 'Backend');
    // Use system Python or venv Python
    const venvPython = path.join(backendPath, '.venv', 'Scripts', 'python.exe');
    const pythonPath = require('fs').existsSync(venvPython) ? venvPython : 'python';
    const appPath = path.join(backendPath, 'app.py');

    // Check if port is available
    const available = await isPortAvailable(BACKEND_PORT);
    if (!available) {
      console.log(`Port ${BACKEND_PORT} in use, attempting to free it...`);
      await killPort(BACKEND_PORT);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('Starting backend server...');
    
    backendProcess = spawn(pythonPath, [appPath], {
      cwd: backendPath,
      env: { ...process.env, FLASK_ENV: 'production' }
    });

    backendProcess.stdout.on('data', (data) => {
      console.log(`Backend: ${data}`);
      if (data.toString().includes('Running on')) {
        resolve();
      }
    });

    backendProcess.stderr.on('data', (data) => {
      console.error(`Backend Error: ${data}`);
    });

    backendProcess.on('error', (error) => {
      console.error('Failed to start backend:', error);
      reject(error);
    });

    // Timeout after 10 seconds
    setTimeout(() => resolve(), 10000);
  });
}

// Start frontend static server
async function startFrontend() {
  return new Promise(async (resolve) => {
    const frontendDist = path.join(__dirname, '..', 'Client', 'dist');
    
    frontendServer = express();
    frontendServer.use(express.static(frontendDist));
    
    frontendServer.get('*', (req, res) => {
      res.sendFile(path.join(frontendDist, 'index.html'));
    });

    const server = frontendServer.listen(FRONTEND_PORT, () => {
      console.log(`Frontend server running on http://localhost:${FRONTEND_PORT}`);
      resolve();
    });

    server.on('error', async (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${FRONTEND_PORT} in use, attempting to free it...`);
        await killPort(FRONTEND_PORT);
        await new Promise(resolve => setTimeout(resolve, 2000));
        startFrontend().then(resolve);
      }
    });
  });
}

// Create main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true
    },
    backgroundColor: '#ffffff',
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'default'
  });

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load the app with retry logic
  let retries = 0;
  const maxRetries = 10;
  
  function loadApp() {
    mainWindow.loadURL(`http://localhost:${FRONTEND_PORT}`)
      .catch((err) => {
        console.error('Failed to load app:', err);
        if (retries < maxRetries) {
          retries++;
          console.log(`Retrying... (${retries}/${maxRetries})`);
          setTimeout(loadApp, 1000);
        } else {
          dialog.showErrorBox(
            'Connection Error',
            'Failed to connect to the application servers. Please ensure both backend and frontend are running.'
          );
        }
      });
  }

  loadApp();

  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(async () => {
  console.log('Starting GroveGrab...');
  
  try {
    // Start backend
    await startBackend();
    console.log('Backend started');
    
    // Wait a bit for backend to fully initialize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Start frontend
    await startFrontend();
    console.log('Frontend started');
    
    // Wait a bit for frontend to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create window
    createWindow();
    console.log('Window created');
    
  } catch (error) {
    console.error('Failed to start application:', error);
    dialog.showErrorBox(
      'Startup Error',
      `Failed to start GroveGrab: ${error.message}`
    );
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Cleanup on quit
app.on('before-quit', () => {
  console.log('Shutting down GroveGrab...');
  
  if (backendProcess) {
    backendProcess.kill();
  }
  
  if (frontendServer) {
    // Express server cleanup is automatic
  }
});

// IPC handlers
ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});

ipcMain.handle('check-backend', async () => {
  try {
    const response = await axios.get(`http://localhost:${BACKEND_PORT}/health`, {
      timeout: 2000
    });
    return response.status === 200;
  } catch (error) {
    return false;
  }
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
});
