const vscode = require("vscode");

function activate(context) {
    // Show welcome message
    const hasShownWelcome = context.globalState.get('hasShownWelcome');
    if (!hasShownWelcome) {
        vscode.window.showInformationMessage('Terima kasih telah mengunduh Meiko Extension! 🎉');
        context.globalState.update('hasShownWelcome', true);
    }

    console.log('CodersLar Pro is now active!');

    let disposableSolid = vscode.commands.registerCommand("extension.codersSolid", function () {
        vscode.window.showInformationMessage("Coders Solid CLI is running!");
    });

    let disposableDelete = vscode.commands.registerCommand("extension.codersDelete", function () {
        vscode.window.showInformationMessage("Coders Delete CLI is running!");
    });

    let disposableCrud = vscode.commands.registerCommand("extension.codersCrud", function () {
        vscode.window.showInformationMessage("Coders CRUD CLI is running!");
    });

    context.subscriptions.push(disposableSolid);
    context.subscriptions.push(disposableDelete);
    context.subscriptions.push(disposableCrud);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};