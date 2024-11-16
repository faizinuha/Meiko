#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const deleteprogress = new CliProgress.SigleBar({
  format: "progress | {bar} | {percentage)%",
  barCompleteChar: "\u2588",
  barIncompleteChar: "\u2591",
  hideCursor: true,
  clearOnComplete: true,
});

function deleteSolidStructure(basePath) {
  const directories = [
    "app",
    "app/Entities",
    "app/Repositories",
    "app/Services",
    "app/Controllers",
    "app/Interfaces",
    "app/Http/Requests"
  ];
  // Mulai progress bar
  progressBar.start(directories.length, 0);
  const files = [
    "app/Entities/ExampleEntity.php",
    "app/Repositories/ExampleRepository.php",
    "app/Services/ExampleService.php",
    "app/Controllers/ExampleController.php",
    "app/Interfaces/RepositoryInterface.php",
    "app/Http/Requests/ExampleRequest.php"
  ];

  // Hapus file
  files.forEach((file) => {
    const filePath = path.join(basePath, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    } else {
      console.log(`File not found (skipped): ${filePath}`);
    }
  });

  // Hapus folder (jika kosong)
  directories.reverse().forEach((dir) => {
    const dirPath = path.join(basePath, dir);
    if (fs.existsSync(dirPath)) {
      const filesInDir = fs.readdirSync(dirPath);
      if (filesInDir.length === 0) {
        fs.rmdirSync(dirPath);
        console.log(`Deleted folder: ${dirPath}`);
      } else {
        console.log(`Folder not empty (skipped): ${dirPath}`);
      }
    } else {
      console.log(`Folder not found (skipped): ${dirPath}`);
    }
  });

  console.log(
    "Cleanup completed. Only specified files and folders were deleted."
  );
}

const basePath = process.cwd();
deleteSolidStructure(basePath);
