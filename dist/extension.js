"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const fileWatcher_1 = require("./features/fileWatcher");
function activate(context) {
    try {
        // Inisialisasi FileWatcher untuk mengubah nama file pendek ke panjang
        new fileWatcher_1.FileWatcherFeature(context);
        console.log('File Watcher Extension berhasil diaktifkan!');
    }
    catch (error) {
        console.error('Terjadi kesalahan saat mengaktifkan extension:', error);
    }
}
function deactivate() { }
//# sourceMappingURL=extension.js.map