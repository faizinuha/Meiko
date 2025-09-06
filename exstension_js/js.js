/*
  File JavaScript untuk menambahkan efek blur pada latar belakang
  saat Command Palette (Palet Perintah) muncul.
*/

// Dapatkan elemen kontainer utama yang akan dipantau
const workbench = document.querySelector(".monaco-workbench");

// Gunakan MutationObserver untuk mengamati perubahan pada elemen utama
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
            // Periksa apakah elemen Command Palette sudah ada
            const commandDialog = document.querySelector(".quick-input-widget");
            if (commandDialog) {
                // Hapus observer yang lama dan siapkan observer baru
                observer.disconnect();
                
                // Tambahkan atau hapus efek blur berdasarkan visibility Command Palette
                const styleObserver = new MutationObserver(styleMutations => {
                    for (const styleMutation of styleMutations) {
                        if (styleMutation.attributeName === 'style') {
                            if (commandDialog.style.display === 'none') {
                                removeBlur();
                            } else {
                                addBlur();
                            }
                        }
                    }
                });
                styleObserver.observe(commandDialog, { attributes: true });

                // Tambahkan listener untuk event keyboard
                document.addEventListener('keydown', event => {
                    if (event.key === 'Escape' || event.key === 'Esc') {
                        removeBlur();
                    }
                });
            }
        }
    });
});

// Mulai mengamati perubahan pada kontainer utama
if (workbench) {
    observer.observe(workbench, { childList: true, subtree: true });
}

// Fungsi untuk menambahkan elemen blur
function addBlur() {
    // Hapus elemen blur yang sudah ada
    const existingBlur = document.getElementById("command-blur");
    if (existingBlur) {
        existingBlur.remove();
    }
    
    // Buat elemen blur baru
    const newBlur = document.createElement("div");
    newBlur.id = 'command-blur';
    newBlur.style.transition = "opacity .3s ease-in-out";
    newBlur.style.opacity = 0;
    
    // Tambahkan listener untuk menghapus elemen saat diklik
    newBlur.addEventListener('click', () => newBlur.remove());

    // Masukkan elemen blur ke dalam DOM
    document.body.appendChild(newBlur);
    
    // Tunda transisi agar terlihat smooth
    setTimeout(() => { newBlur.style.opacity = 1; }, 1);
}

// Fungsi untuk menghapus elemen blur
function removeBlur() {
    const blurElement = document.getElementById("command-blur");
    if (blurElement) {
        blurElement.style.opacity = 0;
        setTimeout(() => blurElement.remove(), 300);
    }
}
