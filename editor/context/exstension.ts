import * as vscode from 'vscode';
import * as prettier from 'prettier';

// Import JSON config using require (if this still causes an error, use import statement)
const formatterConfig = require('./formatter.json');

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.formatWithCustomFormatter', async () => { // Mark the command function as async
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const document = editor.document;
      const unformattedText = document.getText();

      // Format the text using Prettier with the configuration from formatter.json
      const formattedText = await prettier.format(unformattedText, { // Use await here
        ...formatterConfig,
        parser: "babel"
      });

      // Replace the text in the editor
      editor.edit(editBuilder => {
        const firstLine = document.lineAt(0);
        const lastLine = document.lineAt(document.lineCount - 1);
        const textRange = new vscode.Range(firstLine.range.start, lastLine.range.end);

        // Now formattedText is a string
        editBuilder.replace(textRange, formattedText);
      });
    }
  });

  context.subscriptions.push(disposable);
}