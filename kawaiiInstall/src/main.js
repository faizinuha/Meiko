const { app, BrowserWindow, ipcMain, dialog, globalShortcut } = require("electron");
const path = require("path");
const { exec } = require("child_process");

let mainWindow;
let selectedDirectory = "";

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    fullscreen: false,
    resizable: true,
    frame: true,
    icon: path.join(__dirname, "../assets/Anime_pixel_Art1.png"),
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    }    
  });

  mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));

  globalShortcut.register("F11", () => {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
    return false;
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

// Event pilih folder
ipcMain.handle("select-directory", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });

  if (!result.canceled) {
    selectedDirectory = result.filePaths[0];
    return selectedDirectory;
  }
  return null;
});

// Function install framework
const installFramework = (framework, command, projectName) => {
  if (!selectedDirectory) {
    mainWindow.webContents.send("install-error", `❌ Pilih folder terlebih dahulu!`);
    return;
  }

  if (!projectName || projectName.trim() === "") {
    mainWindow.webContents.send("install-error", `${framework} ❌ Nama proyek tidak boleh kosong!`);
    return;
  }

  mainWindow.webContents.send("install-progress", `🔄 Installing ${framework}...`);

  exec(`cd "${selectedDirectory}" && ${command} ${projectName}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error installing ${framework}:`, stderr);
      mainWindow.webContents.send("install-error", `❌ ${framework} gagal di-install.`);
    } else {
      console.log(`${framework} Installed:`, stdout);
      mainWindow.webContents.send("install-success", `✅ ${framework} berhasil di-install.`);
    }
  });
};

// Laravel
ipcMain.on("install-laravel", (_event, { projectName }) => {
  installFramework("Laravel", "composer create-project --prefer-dist laravel/laravel", projectName);
});

// React.js
ipcMain.on("install-react", (_event, { projectName }) => {
  installFramework("React.js", "npx create-react-app", projectName);
});

// Next.js
ipcMain.on("install-next", (_event, { projectName }) => {
  installFramework("Next.js", "npx create-next-app", projectName);
});