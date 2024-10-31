const vscode = require("vscode");
const prettier = require("prettier");
const formatterConfig = require("./formatter.json");

function activate(context) {
  // Register command and push it directly to context.subscriptions
  const disposable = vscode.commands.registerCommand(
    'extension.formatWithCustomFormatter',
    async () => {
      vscode.window.showInformationMessage("Command is working!");
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const unformattedText = document.getText();

        try {
          // Check if the text is empty before formatting
          if (unformattedText.trim() === "") {
            vscode.window.showErrorMessage("Document is empty. Nothing to format.");
            return;
          }

          // Format text using Prettier
          const formattedText = await prettier.format(unformattedText, {
            ...formatterConfig,
            parser: document.languageId === "javascript" ? "babel" : "html"
          });

          // Replace text in the editor
          editor.edit((editBuilder) => {
            const firstLine = document.lineAt(0);
            const lastLine = document.lineAt(document.lineCount - 1);
            const textRange = new vscode.Range(
              firstLine.range.start,
              lastLine.range.end
            );

            editBuilder.replace(textRange, formattedText);
          });
        } catch (error) {
          vscode.window.showErrorMessage(`Formatting failed: ${error.message}`);
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}

module.exports = {
  activate
};
