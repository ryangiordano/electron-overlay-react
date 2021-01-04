/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';
import { createServer } from './Server/Server';
import { screenSize } from './Constants';
import BrowserOverlayWindow from './ElectronComponents/BrowserOverlayWindow';
import SlackController from './Server/Controllers/SlackController';

let mainWindow: BrowserWindow | null = null;
const overlayWindow = new BrowserOverlayWindow({ screenSize });

app.disableHardwareAcceleration();

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: screenSize.width,
    height: screenSize.height,
    frame: true,
    show: false,
    webPreferences:
      (process.env.NODE_ENV === 'production' ||
        process.env.E2E_BUILD === 'true') &&
      process.env.ERB_SECURE !== 'true'
        ? {
            nodeIntegration: true,
            devTools: false,
            enableRemoteModule: true,
          }
        : {
            preload: path.join(__dirname, 'dist/renderer.prod.js'),
            devTools: false,
            enableRemoteModule: true,
          },
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', async () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.showInactive();

      mainWindow.focus();
    }
    const slackController = new SlackController();
    slackController.initializeContext();
    const validTokens = await slackController.hasValidTokens();
    if (validTokens) {
      mainWindow?.webContents.send('navigate', { route: 'home' });
    } else {
      mainWindow?.webContents.send('navigate', { route: 'register' });
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  globalShortcut.register('Shift+Esc', () => {
    overlayWindow?.closeWindow();
  });
};

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// ===================================================
// Event listeners
// ===================================================

/**
 * Respect the OSX convention of having the application in memory even after all windows have been closed
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

if (process.env.E2E_BUILD === 'true') {
  app
    .whenReady()
    .then(() => {
      createWindow();
      createServer();
      return app;
    })
    .catch((e) => {
      throw new Error(e);
    });
} else {
  app.on('ready', () => {
    createWindow();
    createServer();
  });
}

/**
 * On macOS it's common to re-create a window in the app when the
  dock icon is clicked and there are no other windows open.
 */
app.on('activate', () => {
  if (mainWindow === null) createWindow();
});

// ===================================================
// Communicating with the overlay window
// ===================================================
ipcMain.on('open-overlay', (_event, { id }) => {
  overlayWindow.openWindow();
  overlayWindow.hide();

  overlayWindow.loadURL(`file://${__dirname}/app.html`)?.then(() => {
    // TODO(rgiordano): Think of a more elegant solution for this:
    setTimeout(() => {
      overlayWindow.send('navigate', { route: 'channel', id });
    }, 500);
  });
});
