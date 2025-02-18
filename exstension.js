const vscode = require('vscode');

function activate(context) {
    vscode.window.showInformationMessage('CodersLar Pro Activated!');
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
