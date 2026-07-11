const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const { loadProducts, saveProducts, HEADERS } = require('./database');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.setMenuBarVisibility(false);

  mainWindow.loadFile('renderer/index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

ipcMain.handle('db:getProducts', async (_event, dbName) => {
  return loadProducts(dbName);
});

ipcMain.handle('db:saveProducts', async (_event, products, dbName) => {
  return saveProducts(products, dbName);
});

ipcMain.handle('db:newProject', async (_event, dbName) => {
  saveProducts([], dbName);
  return true;
});

ipcMain.handle('db:getHeaders', async () => {
  return HEADERS;
});

ipcMain.handle('db:listDatabases', async () => {
  const fs = require('fs');
  const path = require('path');
  const dataDir = path.join(__dirname, 'data');
  if (!fs.existsSync(dataDir)) return [];
  return fs.readdirSync(dataDir)
    .filter(f => f.endsWith('.xlsx'))
    .map(f => f.replace('.xlsx', ''));
});

ipcMain.handle('dialog:openExcel', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'Open Excel File',
    filters: [{ name: 'Excel', extensions: ['xlsx', 'xls', 'csv'] }],
    properties: ['openFile']
  });
  if (result.canceled) return null;
  return result.filePaths[0];
});

ipcMain.handle('dialog:saveExcel', async () => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Save As',
    filters: [{ name: 'Excel', extensions: ['xlsx'] }]
  });
  if (result.canceled) return null;
  return result.filePath;
});
