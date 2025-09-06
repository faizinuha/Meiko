/*
  File utama ekstensi untuk mengaktifkan kustomisasi UI.
  Ini memastikan file CSS dan JS kustom dimuat oleh VS Code.
*/
const vscode = require('vscode');

let run = async () => {
    const commands = await vscode.commands.getCommands(true);
    if (commands.includes("extension.installCustomCSS")) {
        vscode.commands.executeCommand("extension.installCustomCSS");
    } else {
        vscode.window.showErrorMessage("Custom CSS command not found.");
    }
};

function activate(context) {
    // Dapatkan path ke file CSS dan JS dalam ekstensi
    const extensionPath = context.extensionPath;
    const cssPath = `file://${extensionPath}/css.css`;
    const jsPath = `file://${extensionPath}/js.js`;

    const config = vscode.workspace.getConfiguration();
    let customCssImports = config.get('vscode_custom_css.imports') || [];

    if (!Array.isArray(customCssImports)) {
        customCssImports = [];
    }

    // Tambahkan impor baru jika belum ada
    if (!customCssImports.includes(cssPath) && !customCssImports.includes(jsPath)) {
        customCssImports.push(cssPath);
        customCssImports.push(jsPath);

        config.update('vscode_custom_css.imports', customCssImports, vscode.ConfigurationTarget.Global)
            .then(() => {
                vscode.window.showInformationMessage('Kustomisasi CSS dan JS berhasil ditambahkan!');
                run();
            }, (error) => {
                vscode.window.showErrorMessage(`Gagal memperbarui pengaturan: ${error.message}`);
            });
        
        // Nonaktifkan breadcrumbs untuk tampilan yang lebih bersih
        config.update('breadcrumbs.enabled', false, vscode.ConfigurationTarget.Global);
    }
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
