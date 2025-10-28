const { contextBridge, ipcRenderer } = require("electron");

// creates window.versions
contextBridge.exposeInMainWorld("versions", {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
});

contextBridge.exposeInMainWorld("appBridge", {
  quit: () => ipcRenderer.invoke("quit"),
});
