const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // console.log("process.argv", process.argv)
  if (process.argv.some((_) => _ == "mode=dev")) {
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "index.html"));
  }
}

function start() {
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.whenReady().then(() => {
    ipcMain.handle("ping", () => "pong");

    createMainWindow();
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
      }
    });
  });
}

start();
