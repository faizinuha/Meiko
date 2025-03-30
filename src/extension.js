const vscode = require('vscode');
const { FileWatcherFeature } = require('./features/fileWatcher');

function activate(context) {
    try {
        // Inisialisasi FileWatcher untuk mengubah nama file pendek ke panjang
        new FileWatcherFeature(context);
        console.log('File Watcher Extension berhasil diaktifkan!');

        let disposable = vscode.commands.registerCommand('meiko-web.hello', () => {
            vscode.window.showInformationMessage('Hello from Meiko Web!');
        });

        context.subscriptions.push(disposable);
    } catch (error) {
        console.error('Terjadi kesalahan saat mengaktifkan extension:', error);
    }
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
