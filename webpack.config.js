const path = require("path");

// Konfigurasi webpack untuk pembangunan proyek
module.exports = {
  mode: "production", // Mode produksi untuk optimasi
  entry: {
    codersSolid: "./cli/coders-solid.js",
    crudInstaller: "./cli/crud-installer.js",
    deleteSolid: "./cli/delete-solid.js",
  },
  output: {
    filename: "[name].bundle.js", // Menghasilkan file bundle terpisah
    path: path.resolve(__dirname, "dist"),
  },
  target: "node",
  optimization: {
    minimize: true // Mengoptimasi ukuran file
  }
};
