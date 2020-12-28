/* eslint global-require: off, no-console: off */

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
import { app, BrowserWindow, globalShortcut } from 'electron';
import MenuBuilder from './menu';
import { createServer } from './Server/Server';

const screenSize = {
  width: 1024,
  height: 728,
};

const setFullScreen = (w: BrowserWindow, set: boolean) => {
  if (set) {
    w?.maximize();
  } else {
    w?.unmaximize();
  }
  w?.setIgnoreMouseEvents(set);
  w?.setAlwaysOnTop(set, 'floating');
  w?.setVisibleOnAllWorkspaces(set, { visibleOnFullScreen: set });
};

app.disableHardwareAcceleration();

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];
  return Promise.all(
    extensions.map((name) => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  mainWindow = new BrowserWindow({
    width: screenSize.width,
    height: screenSize.height,
    // transparent: true,
    frame: false,
    alwaysOnTop: true,
    show: false,
    // resizable: false,
    movable: false,
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
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    /**
     * NB: Flashing fullscreen fixes a bug where toggling full screen
     * off the first time shrinks the window to (0,0).
     */
    // mainWindow.setFullScreen(true);
    // mainWindow.setFullScreen(false);

    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.showInactive();

      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  globalShortcut.register('z', () => {
    // mainWindow?.setFullScreen(true);
    app.dock.hide();
    setFullScreen(mainWindow, true);

    // This actually works, creating a new browser window
    // Maybe we can change the FullScreenContext in the view
    // layer to instead open and close a new window
    // setTimeout(() => {
    //   const w = new BrowserWindow({
    //     width: screenSize.width,
    //     height: screenSize.height,
    //     // transparent: true,
    //     frame: false,
    //     alwaysOnTop: true,
    //     show: false,
    //     // resizable: false,
    //     movable: false,
    //     webPreferences:
    //       (process.env.NODE_ENV === 'production' ||
    //         process.env.E2E_BUILD === 'true') &&
    //       process.env.ERB_SECURE !== 'true'
    //         ? {
    //             nodeIntegration: true,
    //             devTools: false,
    //             enableRemoteModule: true,
    //           }
    //         : {
    //             preload: path.join(__dirname, 'dist/renderer.prod.js'),
    //             devTools: false,
    //             enableRemoteModule: true,
    //           },
    //   });
    //   w.show();
    //   w.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    //   w.setAlwaysOnTop(true, 'floating');
    // }, 2000);
  });

  globalShortcut.register('Esc', () => {
    // mainWindow?.setFullScreen(false);
    app.dock.show();
    setFullScreen(mainWindow, false);
  });
};

let mainWindow: BrowserWindow | null = null;

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

/**
 * Add event listeners...
 */
app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

if (process.env.E2E_BUILD === 'true') {
  // eslint-disable-next-line promise/catch-or-return
  app.whenReady().then(() => {
    createWindow();
    createServer();
  });
} else {
  app.on('ready', () => {
    createWindow();
    createServer();
  });
}

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});
