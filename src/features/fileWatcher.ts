import * as path from 'path';
import * as vscode from 'vscode';
import { expandShortFileName } from '../utils/fileNameGenerator';

export class FileWatcherFeature {
    constructor(private context: vscode.ExtensionContext) {
        this.initialize();
    }

    private initialize() {
        // Daftar ekstensi pendek yang didukung
        const shortExtensions = [
            '.b.p', '.b.php',           // Laravel
            '.e.rb', '.erb.h',          // Ruby on Rails
            '.j.tsx', '.tsx.c', '.p.tsx', // React
            '.v.js', '.v.c',            // Vue
            '.c.ts', '.s.ts', '.m.ts',  // Angular
            '.s.svelte',                // Svelte
            '.t.php',                   // PHP
            '.d.py', '.v.py', '.t.py'   // Django
        ];

        const fileWatcher = vscode.workspace.createFileSystemWatcher('**/*');

        fileWatcher.onDidCreate(async (uri) => {
            try {
                const fileName = path.basename(uri.fsPath);
                const dirPath = path.dirname(uri.fsPath);

                // Cek apakah file memiliki ekstensi pendek
                if (shortExtensions.some(ext => fileName.endsWith(ext))) {
                    const newFileName = expandShortFileName(fileName);
                    const newUri = vscode.Uri.file(path.join(dirPath, newFileName));

                    // Cek apakah file baru sudah ada
                    const fileExists = await vscode.workspace.fs.stat(newUri).then(
                        () => true,
                        () => false
                    );

                    if (fileExists) {
                        vscode.window.showWarningMessage(`File ${newFileName} sudah ada.`);
                        return;
                    }

                    // Lakukan rename
                    await vscode.workspace.fs.rename(uri, newUri, { overwrite: false });
                    vscode.window.showInformationMessage(`File ${fileName} diubah menjadi ${newFileName}`);
                }
            } catch (error) {
                // Tangani error secara spesifik
                console.error('Gagal memproses file:', error);
                vscode.window.showErrorMessage(`Gagal memproses file: ${error.message}`);
            }
        });

        // Tambahkan file watcher ke subscription agar bisa dibersihkan saat ekstensi dinonaktifkan
        this.context.subscriptions.push(fileWatcher);
    }
}