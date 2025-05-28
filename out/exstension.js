
// fungsi untuk chat ai 
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const SidebarProvider_1 = require("./SidebarProvider");
const path = __importStar(require("path"));
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "pacar-ai" is now active!');
    // Register the Sidebar Panel
    const sidebarProvider = new SidebarProvider_1.SidebarProvider(context.extensionUri, context);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider("pacar-ai-sidebar", sidebarProvider));
    // Register a command to update the webview with the current file and line information
    context.subscriptions.push(vscode.commands.registerCommand('pacar-ai.updateWebview', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const filePath = editor.document.fileName;
            const fileName = path.basename(filePath); // Dapatkan nama file saja
            const selection = editor.selection;
            const startLine = selection.start.line + 1; // Line numbers are 0-based
            const endLine = selection.end.line + 1; // Line numbers are 0-based
            const webview = sidebarProvider._view;
            if (webview) {
                webview.webview.postMessage({
                    command: 'updateFileInfo',
                    filePath: fileName, // Kirim nama file saja
                    selectedLine: `${startLine}-${endLine}` // Kirim rentang baris yang dipilih
                });
            }
        }
    }));
    // Trigger the updateWebview command when the active editor changes or the selection changes
    vscode.window.onDidChangeActiveTextEditor(() => {
        vscode.commands.executeCommand('pacar-ai.updateWebview');
    });
    vscode.window.onDidChangeTextEditorSelection(() => {
        vscode.commands.executeCommand('pacar-ai.updateWebview');
    });
    // Initial trigger to update the webview
    vscode.commands.executeCommand('pacar-ai.updateWebview');
    context.subscriptions.push(vscode.commands.registerCommand('pacar-ai.applyCodeSelection', (code) => {
        const editor = vscode.window.activeTextEditor;
        console.log("apply code from chat");
        if (editor) {
            const selection = editor.selection;
            editor.edit(editBuilder => {
                // Ganti teks yang dipilih dengan kode baru
                editBuilder.replace(selection, code);
            }).then(() => {
                console.log('Code applied successfully!');
            }, (err) => {
                console.error('Failed to apply code:', err);
            });
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('pacar-ai.triggerCompletion', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const currentLine = editor.selection.active.line;
            // Lakukan edit untuk menambahkan newline di posisi kursor
            editor.edit(editBuilder => {
                // Sisipkan newline di posisi kursor
                editBuilder.insert(editor.selection.active, '\n');
            }).then(() => {
                const currentLineText = editor.document.lineAt(currentLine).text;
                // Cek apakah baris sebelumnya adalah komentar
                if (/^\s*(\/\/|\/\*|\*|#|<!--)/.test(currentLineText)) {
                    console.log("code completion generate..");
                    // Jika baris sebelumnya adalah komentar, jalankan logika triggerCodeCompletion
                    const allCode = editor.document.getText(); // Dapatkan seluruh kode dari editor
                    let coding = currentLineText + '\n'; // Tambahkan baris sebelumnya ke coding
                    // Panggil fungsi untuk membersihkan comment dan trigger completion
                    const cleanCode = removeCommentTags(coding);
                    triggerCodeCompletion(context, cleanCode, allCode);
                }
            });
        }
    }));
}
function onUserInput(line) {
    // Simpan line ke riwayat
    console.log(line);
}
function removeCommentTags(code) {
    return code
        .replace(/\/\/(.*)$/gm, '$1') // Menghapus // dan menyimpan teks setelahnya
        .replace(/\/\*[\s\S]*?\*\//g, '') // Menghapus komentar multi-baris
        .replace(/#(.*)$/gm, '$1') // Menghapus # dan menyimpan teks setelahnya
        .replace(/<!--([\s\S]*?)-->/g, '$1') // Menghapus komentar HTML, termasuk yang multiline
        .replace(/\n\s*\n/g, '\n') // Menghapus baris kosong yang tersisa
        .trim(); // Menghapus spasi di awal dan akhir
}
async function triggerCodeCompletion(context, comment, allCode) {
    const allCodeData = "```" + allCode + "```";
    
    // Cek token terlebih dahulu
    const token = context.globalState.get('token');
    if (!token) {
        vscode.window.showErrorMessage('Token tidak ditemukan. Silakan login terlebih dahulu.');
        return;
    }

    const loadingStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    loadingStatusBarItem.text = "🔄 Memuat kode dari Pacar AI...";
    loadingStatusBarItem.show();

    try {
        const response = await fetch('https://chat.pacar-ai.my.id/api/code', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: `this is the full code from editor ${allCodeData}. continue the code from instruction comment: "${comment}"`
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gagal mengambil data: ${response.status} - ${errorText}`);
        }

        const coding = await response.json();
        if (!coding) {
            throw new Error('Tidak ada respon kode dari server');
        }

        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const currentLine = editor.selection.active.line;
            const instructionMessage = "Pilih untuk menerima kode dari Pacar AI...";
            vscode.window.showInformationMessage(instructionMessage, { modal: true }, "Terima Kode", "Tolak Kode").then(selection => {
                if (selection === "Terima Kode") {
                    editor.edit(editBuilder => {
                        const instructionStartPosition = new vscode.Position(currentLine, 0);
                        const instructionEndPosition = new vscode.Position(currentLine + 1, 0);
                        editBuilder.delete(new vscode.Range(instructionStartPosition, instructionEndPosition));
                        editBuilder.insert(new vscode.Position(currentLine, 0), `${coding}\n`);
                    });
                } else if (selection === "Tolak Kode") {
                    console.log("Kode ditolak.");
                }
            });
        }
    } catch (error) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
        console.error('Detail error:', error);
    } finally {
        loadingStatusBarItem.dispose();
    }
}
// This method is called when your extension is deactivated
function deactivate() { }
//# sourceMappingURL=extension.js.map