const vscode = require("vscode");
const path = require("path"); // Import modul path untuk menangani path file
const fs = require("fs");   // Import modul fs untuk membaca file

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

    // --- Tambahkan perintah baru untuk membuka Laravel AI Code Generator ---
    let disposableLaravelAIGenerator = vscode.commands.registerCommand("extension.openLaravelAIGenerator", () => {
        // Buat panel webview baru
        const panel = vscode.window.createWebviewPanel(
            'laravelCodeGenerator', // ID unik untuk webview
            'Laravel AI Code Generator', // Judul panel yang akan ditampilkan di VS Code
            vscode.ViewColumn.One, // Kolom tampilan di mana panel akan muncul (misal: di editor pertama)
            {
                enableScripts: true, // Sangat penting: Izinkan JavaScript di dalam webview
                // Izinkan webview untuk memuat sumber daya lokal (seperti CSS/JS yang mungkin terpisah,
                // meskipun di kasus kita semua di satu file HTML)
                localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'src', 'webview'))]
            }
        );

        // Dapatkan path ke file HTML webview
        const webviewHtmlPath = path.join(context.extensionPath, 'src', 'webview', 'index.html');

        // Baca konten HTML dari file
        let htmlContent = '';
        try {
            htmlContent = fs.readFileSync(webviewHtmlPath, 'utf8');
        } catch (error) {
            vscode.window.showErrorMessage(`Gagal memuat konten webview: ${error.message}`);
            console.error('Error loading webview HTML:', error);
            return;
        }

        // Set konten HTML untuk webview
        panel.webview.html = htmlContent;

        // Opsional: Tambahkan listener untuk komunikasi antara webview dan ekstensi
        // Ini berguna jika Anda ingin webview mengirim data kembali ke ekstensi
        // (misalnya, untuk menyimpan kode yang dihasilkan ke file di workspace)
        panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'alert': // Contoh: jika webview mengirim pesan 'alert'
                        vscode.window.showInformationMessage(message.text);
                        return;
                    // Anda bisa menambahkan case lain di sini untuk perintah dari webview
                    // Contoh:
                    // case 'saveCodeToFile':
                    //     // Logika untuk menyimpan kode ke file
                    //     break;
                }
            },
            undefined,
            context.subscriptions
        );
    });
    // --- Akhir penambahan perintah baru ---

    context.subscriptions.push(disposableSolid);
    context.subscriptions.push(disposableDelete);
    context.subscriptions.push(disposableCrud);
    context.subscriptions.push(disposableLaravelAIGenerator); // Jangan lupa tambahkan ke subscriptions
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
