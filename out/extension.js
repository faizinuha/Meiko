const vscode = require('vscode');
const path = require('path'); // Import modul path untuk menangani path file
const fs = require('fs'); // Import modul fs untuk membaca file

function activate(context) {
  // Show welcome message
  const hasShownWelcome = context.globalState.get('hasShownWelcome');
  if (!hasShownWelcome) {
    vscode.window.showInformationMessage(
      'Terima kasih telah mengunduh Meiko Extension! 🎉'
    );
    context.globalState.update('hasShownWelcome', true);
  }

  console.log('CodersLar Pro is now active!');

  let disposableSolid = vscode.commands.registerCommand(
    'extension.codersSolid',
    function () {
      vscode.window.showInformationMessage('Coders Solid CLI is running!');
    }
  );

  let disposableDelete = vscode.commands.registerCommand(
    'extension.codersDelete',
    function () {
      vscode.window.showInformationMessage('Coders Delete CLI is running!');
    }
  );

  let disposableCrud = vscode.commands.registerCommand(
    'extension.codersCrud',
    function () {
      vscode.window.showInformationMessage('Coders CRUD CLI is running!');
    }
  );

  // --- Perintah untuk menyimpan API Key ---
  let disposableSetApiKey = vscode.commands.registerCommand(
    'meiko.setApiKey',
    async () => {
      const apiKey = await vscode.window.showInputBox({
        prompt: 'Masukkan Gemini API Key Anda',
        password: true, // Menyembunyikan input
        ignoreFocusOut: true, // Menjaga input box tetap terbuka
        placeHolder: 'AIzaSy...xxxxxxxxxxxx',
      });

      if (apiKey) {
        // Simpan API key ke SecretStorage
        await context.secrets.store('geminiApiKey', apiKey);
        vscode.window.showInformationMessage(
          'Gemini API Key berhasil disimpan dengan aman.'
        );
      } else {
        vscode.window.showWarningMessage(
          'Penyimpanan API Key dibatalkan.'
        );
      }
    }
  );

  // --- Tambahkan perintah baru untuk membuka Laravel AI Code Generator ---
  let disposableLaravelAIGenerator = vscode.commands.registerCommand(
    'extension.openLaravelAIGenerator',
    () => {
      // Buat panel webview baru
      const panel = vscode.window.createWebviewPanel(
        'laravelCodeGenerator', // ID unik untuk webview
        'Laravel AI Code Generator', // Judul panel yang akan ditampilkan di VS Code
        vscode.ViewColumn.One, // Kolom tampilan di mana panel akan muncul (misal: di editor pertama)
        {
          enableScripts: true, // Sangat penting: Izinkan JavaScript di dalam webview
          // Izinkan webview untuk memuat sumber daya lokal (seperti CSS/JS yang mungkin terpisah,
          // meskipun di kasus kita semua di satu file HTML)
          localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'src'))],
        }
      );

      // Dapatkan path ke file HTML webview
      const webviewHtmlPath = path.join(
        context.extensionPath,
        'src/webview/index.html'
      );

      // Baca konten HTML dari file
      let htmlContent = '';
      try {
        htmlContent = fs.readFileSync(webviewHtmlPath, 'utf8');
      } catch (error) {
        vscode.window.showErrorMessage(
          `Gagal memuat konten webview: ${error.message}`
        );
        console.error('Error loading webview HTML:', error);
        return;
      }

      // Set konten HTML untuk webview
      panel.webview.html = htmlContent;

      // Opsional: Tambahkan listener untuk komunikasi antara webview dan ekstensi
      // Ini berguna jika Anda ingin webview mengirim data kembali ke ekstensi
      // (misalnya, untuk menyimpan kode yang dihasilkan ke file di workspace)
      panel.webview.onDidReceiveMessage(
        (message) => {
          if (message.command === 'getApiKey') {
            // Webview meminta API Key, ambil dari SecretStorage
            context.secrets.get('geminiApiKey').then((apiKey) => {
              if (apiKey) {
                // Kirim API key ke webview
                panel.webview.postMessage({
                  command: 'apiKeyResponse',
                  key: apiKey,
                });
              } else {
                // Jika API key tidak ditemukan
                vscode.window.showErrorMessage(
                  'Gemini API Key tidak ditemukan. Silakan atur melalui perintah "Meiko: Set Gemini API Key".'
                );
              }
            });
          } else if (message.command === 'saveCodeToFile') {
            const { type, code, entityName } = message;

            if (!vscode.workspace.workspaceFolders) {
              vscode.window.showErrorMessage(
                'Harap buka folder atau workspace terlebih dahulu untuk menyimpan file.'
              );
              return;
            }

            const workspacePath = vscode.workspace.workspaceFolders[0].uri;
            let filePath;
            let fileName;

            // Tentukan path dan nama file berdasarkan tipe kode
            switch (type) {
              case 'model':
                fileName = `${entityName}.php`;
                filePath = vscode.Uri.joinPath(workspacePath, 'app', 'Models', fileName);
                break;
              case 'controller':
                fileName = `${entityName}Controller.php`;
                filePath = vscode.Uri.joinPath(workspacePath, 'app', 'Http', 'Controllers', fileName);
                break;
              case 'migration':
                // Nama file migration biasanya memiliki timestamp. Kita buat yang sederhana.
                const timestamp = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '_');
                fileName = `${timestamp}_create_${entityName.toLowerCase()}s_table.php`;
                filePath = vscode.Uri.joinPath(workspacePath, 'database', 'migrations', fileName);
                break;
              case 'routes':
                // Untuk route, kita akan tambahkan ke file yang sudah ada.
                filePath = vscode.Uri.joinPath(workspacePath, 'routes', 'api.php');
                vscode.workspace.fs.readFile(filePath).then(existingContent => {
                  const newContent = new TextEncoder().encode(existingContent.toString() + '\n' + code);
                  vscode.workspace.fs.writeFile(filePath, newContent).then(() => {
                    vscode.window.showInformationMessage(`Route berhasil ditambahkan ke ${filePath.fsPath}`);
                  });
                }, err => {
                    vscode.window.showErrorMessage(`Gagal membaca file routes/api.php: ${err.message}`);
                });
                return; // Keluar dari fungsi karena ini adalah operasi append
              default:
                vscode.window.showErrorMessage(`Tipe file tidak dikenal: ${type}`);
                return;
            }

            // Tulis file baru
            const contentBuffer = new TextEncoder().encode(code);
            vscode.workspace.fs.writeFile(filePath, contentBuffer).then(
              () => {
                vscode.window.showInformationMessage(`File berhasil disimpan: ${filePath.fsPath}`);
                // Buka file yang baru disimpan di editor
                vscode.workspace.openTextDocument(filePath).then(doc => vscode.window.showTextDocument(doc));
              },
              (err) => {
                vscode.window.showErrorMessage(`Gagal menyimpan file: ${err.message}`);
              }
            );
          }
        },
        undefined,
        context.subscriptions
      );
    }
  );
  // --- Akhir penambahan perintah baru ---

  context.subscriptions.push(disposableSolid);
  context.subscriptions.push(disposableDelete);
  context.subscriptions.push(disposableCrud);
  context.subscriptions.push(disposableSetApiKey); // Daftarkan perintah baru
  context.subscriptions.push(disposableLaravelAIGenerator); // Jangan lupa tambahkan ke subscriptions
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
