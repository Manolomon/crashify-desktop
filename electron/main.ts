import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import * as fs from 'fs';

let mainWindow: BrowserWindow;

app.on('ready', createWindow);

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1000,
        minHeight: 300,
        icon: path.join(__dirname, '/../../src/assets/icons/mipmap-xxhdpi/ic_launcher.png'),
        webPreferences: {
            nodeIntegration: false,
            nodeIntegrationInWorker: false,
            contextIsolation: false,
            preload: './preload.js'
        }
    });

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, '/../../dist/crashify-desktop/index.html'),
            protocol: 'file:',
            slashes: true
        })
    );

    //mainWindow.webContents.openDevTools();

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

ipcMain.on('getFiles', (event, arg) => {
    const files = fs.readdirSync(__dirname);
    mainWindow.webContents.send('getFilesResponse', files);
});
