const vscode = require('vscode');

let run = async () => {
    const commands = await vscode.commands.getCommands(true);
    if (commands.includes("extension.installCustomCSS")) {
        vscode.commands.executeCommand("extension.installCustomCSS");
    } else {
        vscode.window.showErrorMessage("Custom CSS command not found.");
    }
};

function activate(context) {
    // Get paths to CSS and JS files in the extension
    const extensionPath = context.extensionPath;
    const cssPath = `file://${extensionPath}/css.css`;
    const jsPath = `file://${extensionPath}/js.js`;

    // Get the current user settings
    const config = vscode.workspace.getConfiguration();

    // Get the current imports array
    let customCssImports = config.get('vscode_custom_css.imports') || [];

    // Ensure the imports array exists and is an array
    if (!Array.isArray(customCssImports)) {
        customCssImports = [];
    }

    // Add the new CSS import if it's not already in the array
    if (!customCssImports.includes(cssPath) && !customCssImports.includes(jsPath)) {
        customCssImports.push(cssPath);
        customCssImports.push(jsPath);

        // Update the settings with the modified array
        config.update('vscode_custom_css.imports', customCssImports, vscode.ConfigurationTarget.Global)
            .then(() => {
                vscode.window.showInformationMessage('Custom CSS and JS import added successfully!');
                run();
            }, (error) => {
                vscode.window.showErrorMessage(`Failed to update settings: ${error.message}`);
            });

        config.update('breadcrumbs.enabled', false, vscode.ConfigurationTarget.Global);
    }
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};