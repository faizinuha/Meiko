window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("version").innerText = "Version: 1.0.2";
  document.getElementById("creator").innerText = "Create By: Vibes 💖";
  document.body.addEventListener("click", () => {
    document.getElementById("userInput").focus();
  });
});
