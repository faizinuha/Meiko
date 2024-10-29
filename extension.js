const vscode = require("vscode");

function activate(context) {
  // Listener untuk perubahan konfigurasi
  vscode.workspace.onDidChangeConfiguration((e) => {
    if (
      e.affectsConfiguration("coderslar.theme") ||
      e.affectsConfiguration("coderslar.backgroundImage")
    ) {
      applyThemeSettings();
    }
  });

  // Mendaftarkan command 'coderslar.selectBackgroundImage'
  const selectBackgroundImageCommand = vscode.commands.registerCommand(
    "coderslar.selectBackgroundImage",
    async () => {
      const fileUri = await vscode.window.showOpenDialog({
        canSelectMany: false,
        openLabel: "Select Background Image",
        filters: {
          Images: ["png", "jpg", "jpeg", "gif"],
        },
      });

      if (fileUri && fileUri[0]) {
        const config = vscode.workspace.getConfiguration("coderslar");
        await config.update(
          "backgroundImage",
          fileUri[0].fsPath,
          vscode.ConfigurationTarget.Global
        );
        applyThemeSettings();
        vscode.window.showInformationMessage(
          "Background sudah ganti! Mohon Untuk Relog Sayang >//<",
        );
      }
    }
  );

  // Memasukkan command ke dalam context subscription
  context.subscriptions.push(selectBackgroundImageCommand);

  // Menerapkan pengaturan tema saat extension diaktifkan
  applyThemeSettings();
}

function applyThemeSettings() {
  const config = vscode.workspace.getConfiguration("coderslar");
  const theme = config.get("theme");
  const backgroundImage = config.get("backgroundImage");

  // Mengatur tema berdasarkan pilihan pengguna
  let colorTheme = "Default Dark+";
  let colorCustomizations = {};

  if (theme === "Dark") {
    colorTheme = "Default Dark+";
  } else if (theme === "Light") {
    colorTheme = "Default Light+";
  } else if (theme === "Custom Background" && backgroundImage) {
    colorCustomizations = {
      "editor.background": `url(${backgroundImage})`,
    };
  }

  // Menerapkan warna kustom dan tema kerja
  vscode.workspace
    .getConfiguration()
    .update(
      "workbench.colorCustomizations",
      colorCustomizations,
      vscode.ConfigurationTarget.Global
    );
  vscode.workspace
    .getConfiguration()
    .update(
      "workbench.colorTheme",
      colorTheme,
      vscode.ConfigurationTarget.Global
    );
}

exports.activate = activate;

function deactivate() {}

exports.deactivate = deactivate;
