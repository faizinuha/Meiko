import * as path from 'path';
import * as vscode from 'vscode';
import { expandShortFileName } from '../utils/fileNameGenerator';

export class FileWatcherFeature {
    constructor(private context: vscode.ExtensionContext) {
        this.initialize();
    }

    private initialize() {
        const fileWatcher = vscode.workspace.createFileSystemWatcher('**/*');
        
        fileWatcher.onDidCreate(async (uri) => {
            const fileName = path.basename(uri.fsPath);
            const dirPath = path.dirname(uri.fsPath);
            
            // Deteksi ekstensi pendek untuk semua framework
            const shortExtensions = [
                '.b.p', '.b.php',           // Laravel
                '.e.rb', '.erb.h',          // Ruby
                '.j.tsx', '.tsx.c', '.p.tsx', // React
                '.v.js', '.v.c',            // Vue
                '.c.ts', '.s.ts', '.m.ts',  // Angular
                '.s.svelte',                // Svelte
                '.t.php',                   // PHP
                '.d.py', '.v.py', '.t.py'   // Django
            ];

            if (shortExtensions.some(ext => fileName.endsWith(ext))) {
                try {
                    const newFileName = expandShortFileName(fileName);
                    const newUri = vscode.Uri.file(path.join(dirPath, newFileName));
                    await vscode.workspace.fs.rename(uri, newUri, { overwrite: false });
                    vscode.window.showInformationMessage(`File ${fileName} diubah menjadi ${newFileName}`);
                } catch (error) {
                    console.error('Gagal mengubah nama file:', error);
                }
            }
        });

        this.context.subscriptions.push(fileWatcher);
    }
}