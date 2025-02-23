const path = require("path");

module.exports = {
  mode: "production",
  entry: {
    codersSolid: "/cli/coders-solid.js",
    crudInstaller: "/cli/crud-installer.js",
    deleteSolid: "/cli/delete-solid.js",
  },
  output: {
    filename: "[name].bundle.js", // Akan menghasilkan codersSolid.bundle.js, crudInstaller.bundle.js, deleteSolid.bundle.js
    path: path.resolve(__dirname, "dist"),
  },
  target: "node",
};
