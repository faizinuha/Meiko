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
exports.SidebarProvider = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
class SidebarProvider {
    _extensionUri;
    context;
    _view;
    constructor(_extensionUri, context) {
        this._extensionUri = _extensionUri;
        this.context = context;
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        const selectedText = webviewView.webview.onDidReceiveMessage((message) => {
            if (message.command === 'getSelectedText') {
                const editor = vscode.window.activeTextEditor;
                if (editor) {
                    const allCode = editor.document.getText();
                    const selection = editor.selection;
                    const text = editor.document.getText(selection);
                    // Kirim ke webview
                    webviewView.webview.postMessage({ text, allCode });
                }
                else {
                    // Kirim ke webview
                    webviewView.webview.postMessage({ text: '' });
                }
            }
            else if (message.command === 'applyCodeSelection') {
                const editor = vscode.window.activeTextEditor;
                // console.log("apply code from chat", message.code);
                if (editor) {
                    const selection = editor.selection;
                    editor.edit(editBuilder => {
                        // Ganti teks yang dipilih dengan kode baru
                        editBuilder.replace(selection, message.code);
                    }).then(() => {
                        console.log('Code applied successfully!');
                    }, (err) => {
                        console.error('Failed to apply code:', err);
                    });
                }
            }
            else if (message.command === 'updateFileInfo') {
                this.updateFileInfo(message.filePath, message.selectedLine);
            }
        });
        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);
        webviewView.webview.onDidReceiveMessage(message => {
            switch (message.type) {
                case 'saveToken':
                    // Simpan token di globalState
                    this.context.globalState.update('token', message.token);
                    return;
            }
        }, undefined, this.context.subscriptions);
    }
    updateFileInfo(filePath, selectedLine) {
        if (this._view) {
            this._view.webview.postMessage({
                command: 'updateFileInfo',
                filePath: filePath,
                selectedLine: selectedLine
            });
        }
    }
    getHtmlForWebview(webview) {
        const htmlPath = path.join(this._extensionUri.fsPath, 'media', 'webview.html');
        let htmlContent = fs.readFileSync(htmlPath, 'utf8');
        const logoPath = webview.asWebviewUri(vscode.Uri.file(path.join(this._extensionUri.fsPath, 'media', 'logo.png')));
        const stylesPath = webview.asWebviewUri(vscode.Uri.file(path.join(this._extensionUri.fsPath, 'media', 'styles.css')));
        const prismPath = webview.asWebviewUri(vscode.Uri.file(path.join(this._extensionUri.fsPath, 'media', 'prism.css')));
        const prismJSPath = webview.asWebviewUri(vscode.Uri.file(path.join(this._extensionUri.fsPath, 'media', 'prism.js')));
        const chara = webview.asWebviewUri(vscode.Uri.file(path.join(this._extensionUri.fsPath, 'media', 'Syana Isniya.vrm')));
        const audio = webview.asWebviewUri(vscode.Uri.file(path.join(this._extensionUri.fsPath, 'media', 'welcome.mp3')));
        const vrm = webview.asWebviewUri(vscode.Uri.file(path.join(this._extensionUri.fsPath, 'node_modules/@pixiv/three-vrm/lib/', 'three-vrm.module.js')));
        const background = webview.asWebviewUri(vscode.Uri.file(path.join(this._extensionUri.fsPath, 'media', 'celestia-bg.jpg')));
        ;
        // Replace placeholder with actual logo path htmlContent = htmlContent.replace('%LOGO_PATH%', logoPath.toString());
        htmlContent = htmlContent.replace('%LOGO_PATH%', logoPath.toString());
        htmlContent = htmlContent.replace('%STYLES_PATH%', stylesPath.toString());
        htmlContent = htmlContent.replace('%PRISM_PATH%', prismPath.toString());
        htmlContent = htmlContent.replace('%PRISMJS_PATH%', prismJSPath.toString());
        console.log(chara.toString());
        htmlContent = htmlContent.replace('%CHARA%', chara.toString());
        htmlContent = htmlContent.replace('%VRM%', vrm.toString());
        htmlContent = htmlContent.replace('%AUDIO%', audio.toString());
        htmlContent = htmlContent.replace('%BACKGROUND%', background.toString());
        return htmlContent;
    }
}
exports.SidebarProvider = SidebarProvider;
//# sourceMappingURL=SidebarProvider.js.map