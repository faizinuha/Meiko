let vscode = require('vscode');
function activate(context) {
    console.log('Congratulations, your extension "vue-vscode-snippets" is now active!');
    let disposable = vscode.commands.registerCommand('extension.sayHello', function () {
        vscode.window.showInformationMessage('Hello World!');
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {
}
exports.deactivate = deactivate;