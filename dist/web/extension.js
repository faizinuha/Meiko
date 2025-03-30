(function() {
    const vscode = require('vscode');

    function activate(context) {
        // Show welcome message
        const hasShownWelcome = context.globalState.get('hasShownWelcome');
        if (!hasShownWelcome) {
            vscode.window.showInformationMessage('Terima kasih telah mengunduh Meiko Extension! 🎉');
            context.globalState.update('hasShownWelcome', true);
        }

        console.log('Meiko Web version activated');

        let disposable = vscode.commands.registerCommand('meiko-web.hello', () => {
            vscode.window.showInformationMessage('Hello from Meiko Web!');
        });

        context.subscriptions.push(disposable);
    }

    function deactivate() {}

    // Export untuk environment web
    exports.activate = activate;
    exports.deactivate = deactivate;
})();
