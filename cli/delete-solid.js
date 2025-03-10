#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const cliProgress = require("cli-progress");

// Membuat progress bar untuk penghapusan
const deleteProgress = new cliProgress.SingleBar({
  format: "Progress | {bar} | {percentage}% || {value}/{total} Items",
  barCompleteChar: "\u2588", // Karakter bar penuh
  barIncompleteChar: "\u2591", // Karakter bar kosong
  hideCursor: true,
  clearOnComplete: true,
});

function deleteSolidStructure(basePath) {
  const directories = [
    "app",
    "app/Http",
    "app/Entities",
    "app/Repositories",
    "app/Services",
    "app/Controllers",
    "app/Interfaces",
    "app/Traits",
    "app/Enums",
    "app/Http/Requests",
    "resources/views/posts",
    "database/migration/0000_00_00_create_posts_table.php",
  ];

  const files = [
    "app/Entities/ExampleEntity.php",
    "app/Repositories/ExampleRepository.php",
    "app/Services/ExampleService.php",
    "app/Controllers/ExampleController.php",
    "app/Interfaces/RepositoryInterface.php",
    "app/Http/Requests/ExampleRequest.php",
    "app/Traits/Uploadable.php",
    "app/Enums/FileType.php",
    "app/Controllers/PostController.php",
    "app/Services/PostService.php",
    "app/Repositories/PostRepository.php",
    "app/Entities/PostEntity.php",
    "app/Http/Requests/PostRequest.php",
    "resources/views/posts/index.blade.php",
    "resources/views/posts/create.blade.php",
    "resources/views/posts/edit.blade.php",
    "database/migration/0000_00_00_create_posts_table.php",
  ];

  // Total item untuk progress bar
  const totalItems = files.length + directories.length;
  let processedItems = 0;

  // Mulai progress bar
  deleteProgress.start(totalItems, 0);

  // Hapus file
  files.forEach((file) => {
    const filePath = path.join(basePath, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    processedItems++;
    deleteProgress.update(processedItems);
  });

  // Hapus folder (jika kosong)
  directories.reverse().forEach((dir) => {
    const dirPath = path.join(basePath, dir);
    if (fs.existsSync(dirPath)) {
      const filesInDir = fs.readdirSync(dirPath);
      if (filesInDir.length === 0) {
        fs.rmdirSync(dirPath);
      }
    }
    processedItems++;
    deleteProgress.update(processedItems);
  });

  // Selesai progress bar
  deleteProgress.stop();
  console.log("✨ Solid success: Remove completed");
}

// Base path adalah direktori saat ini
const basePath = process.cwd();
deleteSolidStructure(basePath);
