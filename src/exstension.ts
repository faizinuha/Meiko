import * as vscode from "vscode";
import * as prettier from "prettier";
const formatterConfig = require("./formatter.json");

export function activate(context: vscode.ExtensionContext) {
  // Daftarkan dan langsung push command ke context.subscriptions
  const disposable = vscode.commands.registerCommand(
    "extension.formatWithCustomFormatter",
    async () => {
      vscode.window.showInformationMessage("Command is working!");
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const document = editor.document;
        const unformattedText = document.getText();

        try {
          // Format teks menggunakan Prettier
          const formattedText = await prettier.format(unformattedText, {
            ...formatterConfig,
            parser: "babel",
          });

          // Ganti teks di editor
          editor.edit((editBuilder) => {
            const firstLine = document.lineAt(0);
            const lastLine = document.lineAt(document.lineCount - 1);
            const textRange = new vscode.Range(
              firstLine.range.start,
              lastLine.range.end
            );

            editBuilder.replace(textRange, formattedText);
          });
        } catch (error: any) {
          vscode.window.showErrorMessage(`Formatting failed: ${error.message}`);
        }
      }
    }
  );

  context.subscriptions.push(disposable);
}
