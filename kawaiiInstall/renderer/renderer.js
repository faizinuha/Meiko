const { ipcRenderer } = require('electron');
window.ipcRenderer = ipcRenderer;

document.addEventListener("DOMContentLoaded", () => {
  alert("Welcome.....!");

  const inputField = document.getElementById("userInput");
  const helpMessage = document.getElementById("helpMessage");
  const opsiMessage = document.getElementById("opsiMessage");
  const loadingMessage = document.getElementById("loadingMessage"); // Add this line
  const animeAnimation = document.getElementById("animeAnimation");

  const debouncedInputHandler = debounce(function (e) {
    if (e.key === "Enter") {
      const inputValue = inputField.value.trim();
      if (inputValue === "/help") {
        helpMessage.innerHTML = "⏳ Loading...";
        setTimeout(() => {
          helpMessage.innerHTML = `
            <strong>Fitur Yang Sudah Ada >//<:</strong> <br>
            ✅ Install Laravel otomatis <br>
            ✅ Setup React.js dengan 1 klik <br>
            ✅ Integrasi Next.js lebih mudah <br>
            ✅ Dukungan untuk Vue.js <br>
            ✅ Instalasi cepat dan mudah <br>
            <br>`;
        }, 1000);
      } else if (inputValue === "/opsi") {
        opsiMessage.style.display = "block";
        document.querySelectorAll(".install-btn").forEach(button => {
          button.style.display = "block";
        });
      } else {
        helpMessage.innerHTML = "";
        opsiMessage.style.display = "none";
        document.querySelectorAll(".install-btn").forEach(button => {
          button.style.display = "none";
        });
      }
    }
  }, 300);

  inputField.addEventListener("keyup", debouncedInputHandler);

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
    loadingMessage.style.display = "block";
    animeAnimation.style.display = "block"; // Show anime animation
    window.ipcRenderer.send(`install-${selectedFramework}`, { projectName, directory: selectedDirectory });
  });

  window.ipcRenderer.on("install-progress", (_, message) => {
    console.log(message);
  });

  window.ipcRenderer.on("install-success", (_, message) => {
    loadingMessage.style.display = "none";
    animeAnimation.style.display = "none"; // Hide anime animation
    alert(message);
  });

  window.ipcRenderer.on("install-error", (_, message) => {
    loadingMessage.style.display = "none";
    animeAnimation.style.display = "none"; // Hide anime animation
    console.error("Install error:", message);
    alert(message);
  });
});
