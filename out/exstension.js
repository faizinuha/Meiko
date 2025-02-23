const vscode = require("vscode");

function activate(context) {
    console.log('CodersLar Pro is now active!');

    let disposable = vscode.commands.registerCommand("extension.codersSolid", function () {
        vscode.window.showInformationMessage("Coders Solid CLI is running!");
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
