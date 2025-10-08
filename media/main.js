(function () {
  const vscode = acquireVsCodeApi();
  const chatLog = document.getElementById('chat-log');
  const promptInput = document.getElementById('prompt-input');
  const sendButton = document.getElementById('send-button');
  const clearChatButton = document.getElementById('clear-chat-button');
  let loadingMessageElement = null;
  let streamingMessageElement = null; // Elemen untuk menampung pesan yang sedang di-stream
  let attachedFiles = []; // Untuk menyimpan data file yang dilampirkan
  let currentHistoryOffset = 0;

  function sendMessage() {
    const prompt = promptInput.value.trim();
    if ((prompt || attachedFiles.length > 0) && !sendButton.disabled) {
      vscode.postMessage({
        type: 'sendPrompt',
        value: {
          prompt: prompt,
          attachedFileUris: attachedFiles.map((f) => f.uri),
        },
      });
      promptInput.value = '';
      removeAllFilePills(); // Hapus semua pill setelah mengirim
      promptInput.style.height = 'auto';
      sendButton.disabled = true;
    }
  }

  sendButton.addEventListener('click', sendMessage);

  clearChatButton.addEventListener('click', () => {
    // Reset offset saat chat dibersihkan
    currentHistoryOffset = 0;
    const loadMoreButton = document.getElementById('load-more-button');
    if (loadMoreButton) loadMoreButton.remove();
    vscode.postMessage({ type: 'clearChat' });
  });

  promptInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });

  promptInput.addEventListener('input', () => {
    // Deteksi '@' untuk memicu file picker
    if (promptInput.value.endsWith('@')) {
      vscode.postMessage({ type: 'requestFilePicker' });
    }

    promptInput.style.height = 'auto';
    promptInput.style.height = promptInput.scrollHeight + 'px';
  });

  // Beri tahu ekstensi bahwa webview sudah siap untuk menerima data
  window.addEventListener('load', () => {
    vscode.postMessage({ type: 'webviewReady' });
  });

  window.addEventListener('message', (event) => {
    const message = event.data;
    switch (message.type) {
      case 'startStream':
        // Buat gelembung pesan baru untuk asisten, tapi masih kosong
        streamingMessageElement = createMessageElement('assistant');
        chatLog.appendChild(streamingMessageElement);
        break;
      case 'streamChunk':
        // Tambahkan potongan teks ke gelembung pesan yang sedang aktif
        if (streamingMessageElement) {
          streamingMessageElement.querySelector('p').textContent +=
            message.value;
          chatLog.scrollTop = chatLog.scrollHeight;
        }
        break;
      case 'addResponse':
        removeLoadingIndicator();
        addMessage(message.value, 'assistant');
        break;
      case 'showError':
        removeLoadingIndicator();
        addMessage(message.value, 'assistant', true);
        break;
      case 'loadHistory':
        // Hapus chat log saat ini sebelum memuat yang baru
        chatLog.innerHTML = '';
        const { history, hasMore } = message.value;

        if (hasMore) {
          createLoadMoreButton();
        }

        if (history.length === 0) {
          // Tampilkan pesan selamat datang jika tidak ada riwayat
          addMessage(
            "Hello! I'm Meiko. How can I help you today?",
            'assistant'
          );
        } else {
          history.forEach((msg) =>
            addMessage(msg.text, msg.role === 'user' ? 'user' : 'assistant')
          );
          currentHistoryOffset = history.length;
        }
        // Scroll ke bawah setelah memuat riwayat awal
        chatLog.scrollTop = chatLog.scrollHeight;
        break;
      case 'prependOlderMessages':
        const olderMessages = message.value;
        if (olderMessages.length > 0) {
          const firstMessage = chatLog.firstChild;
          const previousScrollHeight = chatLog.scrollHeight;

          olderMessages
            .slice()
            .reverse()
            .forEach((msg) => {
              const messageElement = createMessageElement(
                msg.role === 'user' ? 'user' : 'assistant'
              );
              renderMessageContent(messageElement, msg.text, false);
              chatLog.insertBefore(
                messageElement,
                chatLog.firstChild.nextSibling
              ); // insert after load more button
            });

          currentHistoryOffset += olderMessages.length;
          // Pertahankan posisi scroll
          chatLog.scrollTop = chatLog.scrollHeight - previousScrollHeight;
        }
        break;
      case 'fileAttached':
        addFilePill(message.value.label, message.value.uri);
        break;
      case 'endStream':
        // Hentikan referensi ke elemen streaming dan aktifkan kembali tombol kirim
        streamingMessageElement = null;
        sendButton.disabled = false;
        promptInput.focus();
        break;
      case 'setLoading':
        if (message.value) {
          showLoadingIndicator();
        } else {
          removeLoadingIndicator();
        }
        break;
    }
  });

  function createMessageElement(sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    const p = document.createElement('p');
    messageElement.appendChild(p);
    return messageElement;
  }

  function renderMessageContent(messageElement, text, isError) {
    const p = messageElement.querySelector('p');
    if (isError) {
      messageElement.style.color = 'var(--vscode-errorForeground)';
    }
    // Basic markdown-like formatting for code blocks
    const formattedText = text.replace(/```([\s\S]*?)```/g, (_match, code) => {
      return `<pre><code>${code.trim()}</code></pre>`;
    });
    p.innerHTML = formattedText;
  }

  function addMessage(text, sender, isError = false) {
    const messageElement = createMessageElement(sender);
    renderMessageContent(messageElement, text, isError);

    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function addFilePill(fileName, fileUri) {
    // Hapus '@' yang memicu picker
    promptInput.value = promptInput.value.slice(0, -1);

    // Cek duplikat
    if (attachedFiles.some((f) => f.uri === fileUri)) {
      promptInput.focus();
      return;
    }

    attachedFiles.push({ label: fileName, uri: fileUri });
    renderFilePills();
    promptInput.focus();
  }

  function renderFilePills() {
    const container = document.getElementById('input-area');
    let pillContainer = document.getElementById('file-pill-container');
    if (!pillContainer) {
      pillContainer = document.createElement('div');
      pillContainer.id = 'file-pill-container';
      container.prepend(pillContainer);
    }

    pillContainer.innerHTML = ''; // Hapus pill yang ada untuk dirender ulang
    let totalPillWidth = 0;

    attachedFiles.forEach((file) => {
      const pillElement = document.createElement('div');
      pillElement.className = 'file-pill';
      pillElement.title = file.label;
      pillElement.innerHTML = `
          <span>@${file.label}</span>
          <span class="file-pill-remove" title="Remove file" data-uri="${file.uri}">×</span>
      `;
      pillContainer.appendChild(pillElement);
      totalPillWidth += pillElement.offsetWidth + 4; // 4 adalah gap
    });

    // Sesuaikan padding input agar teks tidak tumpang tindih
    promptInput.style.paddingLeft = `${totalPillWidth + 8}px`;

    // Tambahkan event listener ke semua tombol hapus
    pillContainer.querySelectorAll('.file-pill-remove').forEach((button) => {
      button.addEventListener('click', (e) => {
        const uriToRemove = e.target.getAttribute('data-uri');
        attachedFiles = attachedFiles.filter((f) => f.uri !== uriToRemove);
        renderFilePills();
      });
    });
  }

  function removeAllFilePills() {
    attachedFiles = [];
    renderFilePills();
  }

  function showLoadingIndicator() {
    if (loadingMessageElement) return;
    loadingMessageElement = document.createElement('div');
    loadingMessageElement.classList.add('message', 'assistant', 'loading');
    loadingMessageElement.innerHTML = `<div class="loading-dots"><span></span><span></span><span></span></div>`;
    chatLog.appendChild(loadingMessageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function removeLoadingIndicator() {
    if (loadingMessageElement) {
      chatLog.removeChild(loadingMessageElement);
      loadingMessageElement = null;
    }
  }

  function createLoadMoreButton() {
    const button = document.createElement('button');
    button.id = 'load-more-button';
    button.textContent = 'Load More';
    button.addEventListener('click', () => {
      vscode.postMessage({
        type: 'requestOlderMessages',
        value: {
          offset: currentHistoryOffset,
        },
      });
    });
    chatLog.prepend(button);
  }
})();
