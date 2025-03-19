const { ipcRenderer } = require('electron');
window.ipcRenderer = ipcRenderer;

document.addEventListener("DOMContentLoaded", () => {
  // alert("Welcome.....!");

  const opsiMessage = document.getElementById("opsiMessage");
  const loadingMessage = document.getElementById("loadingMessage");
  const animeAnimation = document.getElementById("animeAnimation");

  // Menampilkan opsi secara langsung
  opsiMessage.style.display = "block";
  document.querySelectorAll(".install-btn").forEach(button => {
    button.style.display = "block";
  });

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
    animeAnimation.style.display = "block"; // Menampilkan animasi anime
    window.ipcRenderer.send(`install-${selectedFramework}`, { projectName, directory: selectedDirectory });
  });

  // Handle install progress
  window.ipcRenderer.on("install-progress", (_, message) => {
    console.log(message);
  });

  // Handle install success
  window.ipcRenderer.on("install-success", (_, message) => {
    loadingMessage.style.display = "none";
    animeAnimation.style.display = "none"; // Menyembunyikan animasi anime
    alert(message);
  });

  // Handle install error
  window.ipcRenderer.on("install-error", (_, message) => {
    loadingMessage.style.display = "none";
    animeAnimation.style.display = "none"; // Menyembunyikan animasi anime
    console.error("Install error:", message);
    alert(message);
  });
});
