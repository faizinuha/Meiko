const { ipcRenderer } = require('electron');
window.ipcRenderer = ipcRenderer;

document.addEventListener("DOMContentLoaded", () => {
  alert("Installer Kawaii siap digunakan!");
});

document.addEventListener("DOMContentLoaded", function () {
  const inputField = document.getElementById("userInput");
  const helpMessage = document.getElementById("helpMessage");
  const opsiMessage = document.getElementById("opsiMessage");

  inputField.addEventListener("keypress", function (e) {
      if (e.key === "Enter") { // Cek jika tombol yang ditekan adalah "Enter"
          const inputValue = inputField.value.trim();
          if (inputValue === "/help") {
              helpMessage.innerHTML = "⏳ Loading...";
              
              // Simulasi loading sebelum menampilkan teks
              setTimeout(() => {
                  helpMessage.innerHTML = `
                      <strong>Fitur Yang Sudah Ada >//<:</strong> <br>
                      ✅ Install Laravel otomatis <br>
                      ✅ Setup React.js dengan 1 klik <br>
                      ✅ Integrasi Next.js lebih mudah <br>
                  `;
              }, 1500); // Delay 1.5 detik
          } else if (inputValue === "/opsi") {
              opsiMessage.style.display = "block";
              document.querySelectorAll(".install-btn").forEach(button => {
                button.style.display = "block";
              });
          } else {
              helpMessage.innerHTML = ""; // Kosongkan jika bukan "/help"
              opsiMessage.style.display = "none"; // Sembunyikan opsi jika bukan "/opsi"
              document.querySelectorAll(".install-btn").forEach(button => {
                button.style.display = "none";
              });
          }
      }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("Installer Kawaii siap digunakan!");

  const installButtons = document.querySelectorAll(".install-btn");
  const projectInputContainer = document.getElementById("projectInputContainer");
  const projectNameInput = document.getElementById("projectName");
  const installConfirmBtn = document.getElementById("installConfirmBtn");
  const directoryInfo = document.getElementById("directoryInfo");
  let selectedFramework = "";
  let selectedDirectory = "";

  installButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      selectedFramework = button.dataset.framework;
      projectInputContainer.style.display = "block"; 
      projectNameInput.value = ""; 
      projectNameInput.focus();

      // Pilih folder sebelum install
      selectedDirectory = await window.ipcRenderer.invoke("select-directory");
      if (!selectedDirectory) {
        alert("❌ Pilih folder dulu!");
        return;
      }

      directoryInfo.innerText = `📂 Proyek akan disimpan di: ${selectedDirectory}`;
    });
  });

  installConfirmBtn.addEventListener("click", () => {
    const projectName = projectNameInput.value.trim();
    if (!projectName) {
      alert("❌ Nama proyek tidak boleh kosong!");
      return;
    }

    projectInputContainer.style.display = "none";
    loadingMessage.style.display = "block"; // Tampilkan pesan loading
    window.ipcRenderer.send(`install-${selectedFramework}`, { projectName, directory: selectedDirectory });
  });

  window.ipcRenderer.on("install-progress", (_, message) => {
    console.log(message);
  });

  window.ipcRenderer.on("install-success", (_, message) => {
    loadingMessage.style.display = "none"; // Sembunyikan pesan loading
    alert(message);
  });

  window.ipcRenderer.on("install-error", (_, message) => {
    loadingMessage.style.display = "none"; // Sembunyikan pesan loading
    alert(message);
  });
});
