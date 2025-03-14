window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("version").innerText = "Version: 1.0.2";
  document.getElementById("creator").innerText = "Create By: Vibes 💖";
  document.getElementById("lastUpdated").innerText = "Last Updated: 2022-05-15";
});
window.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", () => {
    document.getElementById("userInput").focus();
  });
});
