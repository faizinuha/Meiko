const { app, BrowserWindow, ipcMain, dialog, globalShortcut } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const { autoUpdater } = require("electron-updater");

let mainWindow;
let selectedDirectory = "";

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
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

  autoUpdater.checkForUpdatesAndNotify();
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});

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

const installFramework = async (framework, command, projectName) => {
  if (!selectedDirectory) {
    mainWindow.webContents.send("install-error", `❌ Pilih folder terlebih dahulu!`);
    return;
  }

  if (!projectName || projectName.trim() === "") {
    mainWindow.webContents.send("install-error", `${framework} ❌ Nama proyek tidak boleh kosong!`);
    return;
  }

  mainWindow.webContents.send("install-progress", `🔄 Installing ${framework}...`);

  try {
    await execPromise(`cd "${selectedDirectory}" && ${command} ${projectName}`);
    mainWindow.webContents.send("install-success", `✅ ${framework} berhasil di-install.`);
  } catch (error) {
    console.error(`Error installing ${framework}:`, error);
    mainWindow.webContents.send("install-error", `❌ ${framework} gagal di-install.`);
  }
};

const execPromise = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};

ipcMain.on("install-laravel", (_event, { projectName }) => {
  installFramework("Laravel", "composer create-project --prefer-dist laravel/laravel", projectName);
});

ipcMain.on("install-react", (_event, { projectName }) => {
  installFramework("React.js", "npx create-react-app", projectName);
});

ipcMain.on("install-next", (_event, { projectName }) => {
  installFramework("Next.js", "npx create-next-app", projectName);
});