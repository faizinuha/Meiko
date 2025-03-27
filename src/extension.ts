import * as vscode from 'vscode';
import { FileWatcherFeature } from './features/fileWatcher';

export function activate(context: vscode.ExtensionContext) {
    try {
        // Inisialisasi FileWatcher untuk mengubah nama file pendek ke panjang
        new FileWatcherFeature(context);
        console.log('File Watcher Extension berhasil diaktifkan!');
    } catch (error) {
        console.error('Terjadi kesalahan saat mengaktifkan extension:', error);
    }
}

export function deactivate() {}
