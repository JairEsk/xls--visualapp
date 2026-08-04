const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getProducts: (dbName) => ipcRenderer.invoke('db:getProducts', dbName),
  saveProducts: (products, dbName) => ipcRenderer.invoke('db:saveProducts', products, dbName),
  getSales: (dbName) => ipcRenderer.invoke('db:getSales', dbName),
  saveSales: (sales, dbName) => ipcRenderer.invoke('db:saveSales', sales, dbName),
  newProject: (dbName) => ipcRenderer.invoke('db:newProject', dbName),
  getHeaders: () => ipcRenderer.invoke('db:getHeaders'),
  listDatabases: () => ipcRenderer.invoke('db:listDatabases'),
  openExcel: () => ipcRenderer.invoke('dialog:openExcel'),
  saveExcel: () => ipcRenderer.invoke('dialog:saveExcel')
});
