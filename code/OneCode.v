#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function createSolidStructure(basePath) {
  const directories = [
    "app/Entities",
    "app/Repositories",
    "app/Services",
    "app/Controllers",
    "app/Interfaces"
  ];

  directories.forEach((dir) => {
    const dirPath = path.join(basePath, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created folder: ${dirPath}`);
    } else {
      console.log(`Folder already exists: ${dirPath}`);
    }
  });

  // Optional: create example files for each folder (e.g., Entity, Repository, Service, etc.)
  fs.writeFileSync(path.join(basePath, "app/Entities/ExampleEntity.php"), "<?php\n\nclass ExampleEntity {}\n");
  fs.writeFileSync(path.join(basePath, "app/Repositories/ExampleRepository.php"), "<?php\n\nclass ExampleRepository {}\n");
  fs.writeFileSync(path.join(basePath, "app/Services/ExampleService.php"), "<?php\n\nclass ExampleService {}\n");
  console.log("SOLID structure has been created successfully.");
}

// Get the base path, where the command is executed
const basePath = process.cwd();
createSolidStructure(basePath);
