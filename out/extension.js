const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { SupabaseDbProvider } = require('./extension2.js');
// Path untuk menyimpan file kredensial (opsional, jika diperlukan)
let storagePath;
let credentialsPath;

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('Congratulations, your extension "meiko" is now active!');

  // Tentukan path untuk menyimpan file account.json (opsional, jika diperlukan)
  storagePath = context.globalStorageUri.fsPath;
  if (!fs.existsSync(storagePath)) {
    fs.mkdirSync(storagePath, { recursive: true });
  }
  credentialsPath = path.join(storagePath, 'account.json');

  // 1. Perintah untuk mengatur API Key / Login
  let setApiKeyCommand = vscode.commands.registerCommand(
    'meiko.setApiKey',
    async () => {
      const choice = await vscode.window.showQuickPick(
        [
          {
            label: 'Enter API Key',
            description: 'Enter your Gemini API Key manually',
          },
        ],
        {
          placeHolder: 'Choose an authentication method for Meiko',
          title: 'Meiko Authentication',
        }
      );

      if (!choice) return; // Pengguna membatalkan

      if (choice.label === 'Enter API Key') {
        const apiKey = await vscode.window.showInputBox({
          prompt: 'Enter your Google Gemini API Key',
          placeHolder: 'AIzaSy...',
          password: true,
          ignoreFocusOut: true,
        });

        if (apiKey) {
          // Simpan API key ke SecretStorage untuk keamanan
          await context.secrets.store('geminiApiKey', apiKey);
          vscode.window.showInformationMessage(
            'Meiko: Gemini API Key has been saved successfully!'
          );
        }
      }
    }
  );

  // --- Perintah untuk Supabase ---
  let supabaseLoginCommand = vscode.commands.registerCommand(
    'meiko.supabaseLogin',
    async () => {
      const accessToken = await vscode.window.showInputBox({
        prompt: 'Enter your Supabase Access Token',
        password: true,
        ignoreFocusOut: true,
        placeHolder: 'sbp_xxxxxxxxxxxxxxxxxxxxxxxx',
      });

      if (accessToken) {
        await context.secrets.store('supabaseAccessToken', accessToken);
        // Langsung panggil fungsi untuk memilih proyek setelah login berhasil
        await showSupabaseProjectPicker(context, accessToken);
      }
    }
  );

  let supabaseLogoutCommand = vscode.commands.registerCommand(
    'meiko.supabaseLogout',
    async () => {
      await context.secrets.delete('supabaseAccessToken');
      await context.globalState.update('activeSupabaseProjectRef', undefined);
      vscode.window.showInformationMessage(
        'Successfully logged out from Supabase.'
      );
    }
  );

  // Perintah ini tidak lagi ditampilkan di Command Palette, tapi tetap ada jika dibutuhkan
  let internalSupabaseSetProjectCommand = vscode.commands.registerCommand(
    'meiko.supabaseSetProject',
    async () => {
      const accessToken = await context.secrets.get('supabaseAccessToken');
      if (!accessToken) {
        vscode.window.showErrorMessage(
          'Please login to Supabase first using "Meiko: Supabase Login".'
        );
        return;
      }
      await showSupabaseProjectPicker(context, accessToken);
    }
  );

  // 3. Daftarkan WebviewViewProvider untuk chat di sidebar
  const provider = new MeikoChatViewProvider(context.extensionUri, context);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      MeikoChatViewProvider.viewType,
      provider
    )
  );

  context.subscriptions.push(
    setApiKeyCommand,
    supabaseLoginCommand,
    supabaseLogoutCommand,
    internalSupabaseSetProjectCommand
  );

  // --- Supabase DB Explorer ---
  const supabaseDbProvider = new SupabaseDbProvider(context);
  vscode.window.registerTreeDataProvider(
    'supabase.tablesView',
    supabaseDbProvider
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('meiko.supabaseRefreshDbView', () =>
      supabaseDbProvider.refresh()
    )
  );
}

/**
 * Mengambil daftar proyek Supabase dan menampilkannya kepada pengguna untuk dipilih.
 * @param {vscode.ExtensionContext} context
 * @param {string} accessToken
 */
async function showSupabaseProjectPicker(context, accessToken) {
  try {
    const fetch = require('node-fetch');
    const projects = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Fetching Supabase projects...',
        cancellable: false,
      },
      async () => {
        const response = await fetch('https://api.supabase.com/v1/projects', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!response.ok) {
          throw new Error(
            `API Error (${response.status}): ${response.statusText}`
          );
        }
        return await response.json();
      }
    );

    const projectItems = projects.map((p) => ({
      label: p.name,
      description: p.organization_name,
      ref: p.ref,
    }));

    const selectedProject = await vscode.window.showQuickPick(projectItems, {
      placeHolder: 'Select the Supabase project you want to work with',
      title: 'Set Active Project',
    });

    if (selectedProject) {
      await context.globalState.update(
        'activeSupabaseProjectRef',
        selectedProject.ref
      );
      await context.globalState.update(
        'activeSupabaseProjectName',
        selectedProject.label
      );
      vscode.window.showInformationMessage(
        `Active Supabase project set to: ${selectedProject.label}`
      );
      // Refresh DB explorer setelah proyek dipilih
      vscode.commands.executeCommand('meiko.supabaseRefreshDbView');
    }
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to fetch Supabase projects: ${error.message}`
    );
  }
}

class MeikoChatViewProvider {
  static viewType = 'meiko.chatView';

  constructor(extensionUri, context) {
    this._extensionUri = extensionUri;
    this._context = context; // Simpan context untuk akses ke secrets
  }

  resolveWebviewView(webviewView, context, token) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, 'media')],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.type) {
        case 'webviewReady': {
          const history =
            this._context.globalState.get('meikoChatHistory') || [];
          const initialBatch = history.slice(-50); // Kirim 50 pesan terakhir
          this._view.webview.postMessage({
            type: 'loadHistory',
            value: {
              history: initialBatch,
              hasMore: history.length > 50,
            },
          });
          break;
        }
        case 'sendPrompt': {
          // Menggunakan blok untuk scoping
          const { prompt, attachedFileUris } = data.value;
          const apiKey = await this._context.secrets.get('geminiApiKey');

          if (!apiKey) {
            this._view.webview.postMessage({
              type: 'showError',
              value:
                'API Key not set. Run "Meiko: Set Gemini API Key" from the Command Palette.',
            });
            return;
          }

          let fullPrompt = prompt;

          // Jika ada file yang dilampirkan, baca kontennya dan tambahkan ke prompt
          if (attachedFileUris && attachedFileUris.length > 0) {
            let fileContexts = '';
            for (const fileUriString of attachedFileUris) {
              try {
                const fileUri = vscode.Uri.parse(fileUriString);
                const fileContentBytes =
                  await vscode.workspace.fs.readFile(fileUri);
                const fileContent =
                  Buffer.from(fileContentBytes).toString('utf8');
                const fileName = path.basename(fileUri.fsPath);

                fileContexts += `CONTEXT from file "${fileName}":\n\`\`\`\n${fileContent}\n\`\`\`\n\n`;
              } catch (e) {
                this._view.webview.postMessage({
                  type: 'showError',
                  value: `Error reading file: ${e.message}`,
                });
                // Lanjutkan tanpa file ini
              }
            }
            fullPrompt = `${fileContexts}Based on the file context(s) above, please respond to the following prompt:\n${prompt}`;
          }

          // --- LOGIKA AGEN SUPABASE ---
          // Cek apakah ini perintah untuk Supabase
          if (
            prompt.toLowerCase().startsWith('supabase:') ||
            prompt.toLowerCase().startsWith('db:')
          ) {
            const activeProjectRef = this._context.globalState.get(
              'activeSupabaseProjectRef'
            );
            const supabaseToken = await this._context.secrets.get(
              'supabaseAccessToken'
            );

            if (!activeProjectRef || !supabaseToken) {
              this._view.webview.postMessage({
                type: 'showError',
                value:
                  'Supabase project/login not configured. Please run "Meiko: Supabase Login" and "Meiko: Set Active Supabase Project".',
              });
              return;
            }

            // Rekayasa prompt untuk Gemini agar menghasilkan SQL
            const userRequest = prompt
              .substring(prompt.indexOf(':') + 1)
              .trim();
            fullPrompt = `You are an expert PostgreSQL database assistant for Supabase. Your task is to translate the user's request into a single, valid SQL command. Infer relationships between tables and add foreign key constraints where appropriate (e.g., a 'user_id' column in a 'posts' table should reference the 'id' in a 'users' table). Do not add any explanation, comments, or introductory text. Only output the raw SQL code.\n\nUser request: "${userRequest}"`;

            // Di sini kita akan menambahkan logika untuk mengeksekusi SQL nanti.
            // Untuk sekarang, kita hanya akan generate SQL dan menampilkannya.
            try {
              const genAI = new GoogleGenerativeAI(apiKey);
              const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
              const result = await model.generateContent(fullPrompt);
              const response = await result.response;
              const sqlCommand = response
                .text()
                .replace(/```sql\n|```/g, '')
                .trim(); // Membersihkan output Gemini

              // Simpan prompt pengguna dan respons SQL ke riwayat
              const history =
                this._context.globalState.get('meikoChatHistory') || [];
              history.push({ role: 'user', text: prompt });
              history.push({
                role: 'assistant',
                text: `Generated SQL for your request:\n\`\`\`sql\n${sqlCommand}\n\`\`\``,
              });
              await this._context.globalState.update(
                'meikoChatHistory',
                history
              );
              this._view.webview.postMessage({
                type: 'addResponse',
                value: `Generated SQL for your request:\n\`\`\`sql\n${sqlCommand}\n\`\`\``,
              });
            } catch (error) {
              this._view.webview.postMessage({
                type: 'showError',
                value: `Failed to generate SQL: ${error.message}`,
              });
            }
            return; // Hentikan eksekusi normal jika ini adalah perintah Supabase
          }

          try {
            // Simpan pesan pengguna ke riwayat SEBELUM mengirim ke AI
            const history =
              this._context.globalState.get('meikoChatHistory') || [];
            history.push({ role: 'user', text: prompt });
            // Kirim riwayat yang diperbarui ke UI agar pesan pengguna muncul
            this._view.webview.postMessage({
              type: 'loadHistory',
              value: {
                history: history.slice(-50),
                hasMore: history.length > 50,
              },
            });
            let fullResponse = '';
            this._view.webview.postMessage({ type: 'startStream' });
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
            const result = await model.generateContentStream(fullPrompt);

            for await (const chunk of result.stream) {
              const chunkText = chunk.text();
              fullResponse += chunkText;
              this._view.webview.postMessage({
                type: 'streamChunk',
                value: chunkText,
              });
            }

            // Setelah stream selesai, simpan respons lengkap dari asisten
            const updatedHistory =
              this._context.globalState.get('meikoChatHistory') || [];
            updatedHistory.push({ role: 'assistant', text: fullResponse });
            await this._context.globalState.update(
              'meikoChatHistory',
              updatedHistory
            );
          } catch (error) {
            console.error(error);
            this._view.webview.postMessage({
              type: 'showError',
              value: `Error: ${error.message}`,
            });
          } finally {
            this._view.webview.postMessage({ type: 'endStream' });
          }
          break;
        }
        case 'requestFilePicker': {
          // Cari semua file di workspace, abaikan node_modules dan .git
          const files = await vscode.workspace.findFiles(
            '**/*',
            '{**/node_modules/**,**/.git/**}'
          );
          const fileItems = files.map((file) => ({
            label: path.basename(file.fsPath),
            description: vscode.workspace.asRelativePath(file, false),
            uri: file.toString(),
          }));

          const selectedFile = await vscode.window.showQuickPick(fileItems, {
            placeHolder: 'Type to search for a file to attach as context',
            title: 'Attach File Context',
          });

          if (selectedFile) {
            this._view.webview.postMessage({
              type: 'fileAttached',
              value: { label: selectedFile.label, uri: selectedFile.uri },
            });
          }
          break;
        }
        case 'clearChat': {
          // Hapus riwayat dari globalState
          await this._context.globalState.update('meikoChatHistory', []);
          // Beri tahu webview untuk membersihkan UI dan menampilkan pesan selamat datang
          this._view.webview.postMessage({
            type: 'loadHistory',
            value: { history: [], hasMore: false },
          });
          vscode.window.showInformationMessage('Meiko: Chat history cleared.');
          break;
        }
        case 'requestOlderMessages': {
          const { offset } = data.value;
          const history =
            this._context.globalState.get('meikoChatHistory') || [];
          const batchSize = 50;

          const startIndex = Math.max(0, history.length - offset - batchSize);
          const endIndex = history.length - offset;
          const olderBatch = history.slice(startIndex, endIndex);

          this._view.webview.postMessage({
            type: 'prependOlderMessages',
            value: olderBatch,
          });
          break;
        }
      }
    });
  }

  _getHtmlForWebview(webview) {
    // Ganti file 'index.html' lama Anda dengan HTML yang dikelola di sini
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'main.js')
    );
    const stylesUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'media', 'styles.css')
    );
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="${stylesUri}" rel="stylesheet">
				<title>Meiko Chat</title>
			</head>
			<body>
                <div id="chat-container">
                    <div id="chat-log">
                        <!-- Riwayat percakapan akan dimuat di sini -->
                    </div>
                </div>
                <div id="input-area">
                    <textarea id="prompt-input" placeholder="Enter your prompt here..."></textarea>
                    <button id="clear-chat-button" title="Clear Chat History">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    </button>
                    <button id="send-button">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                    </button>
                </div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}

function getNonce() {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
