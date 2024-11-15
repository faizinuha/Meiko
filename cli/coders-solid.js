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

  // Membuat folder sesuai struktur SOLID
  directories.forEach((dir) => {
    const dirPath = path.join(basePath, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created folder: ${dirPath}`);
    } else {
      console.log(`Folder already exists: ${dirPath}`);
    }
  });

  // Membuat file contoh di setiap folder
  const files = [
    {
      path: "app/Entities/ExampleEntity.php",
      content: `<?php
namespace App\\Entities;

/**
 * Contoh Entity mengikuti Single Responsibility Principle.
 */
class ExampleEntity {
    private $id;
    private $name;

    public function __construct($id, $name) {
        $this->id = $id;
        $this->name = $name;
    }

    public function getId() {
        return $this->id;
    }

    public function getName() {
        return $this->name;
    }
}
`
    },
    {
      path: "app/Repositories/ExampleRepository.php",
      content: `<?php
namespace App\\Repositories;

use App\\Entities\\ExampleEntity;

/**
 * Contoh Repository mengikuti Dependency Inversion Principle.
 */
class ExampleRepository {
    public function findById($id) {
        // Logika mendapatkan data dari database.
        return new ExampleEntity($id, "Example Name");
    }
}
`
    },
    {
      path: "app/Services/ExampleService.php",
      content: `<?php
namespace App\\Services;

use App\\Repositories\\ExampleRepository;

/**
 * Contoh Service mengikuti Interface Segregation Principle.
 */
class ExampleService {
    private $repository;

    public function __construct(ExampleRepository $repository) {
        $this->repository = $repository;
    }

    public function getEntityById($id) {
        return $this->repository->findById($id);
    }
}
`
    },
    {
      path: "app/Controllers/ExampleController.php",
      content: `<?php
namespace App\\Controllers;

use App\\Services\\ExampleService;

/**
 * Contoh Controller.
 */
class ExampleController {
    private $service;

    public function __construct(ExampleService $service) {
        $this->service = $service;
    }

    public function show($id) {
        $entity = $this->service->getEntityById($id);
        return json_encode([
            'id' => $entity->getId(),
            'name' => $entity->getName()
        ]);
    }
}
`
    },
    {
      path: "app/Interfaces/RepositoryInterface.php",
      content: `<?php
namespace App\\Interfaces;

/**
 * Contoh Interface mengikuti Liskov Substitution Principle.
 */
interface RepositoryInterface {
    public function findById($id);
}
`
    }
  ];

  // Membuat file dengan konten masing-masing
  files.forEach((file) => {
    const filePath = path.join(basePath, file.path);
    const fileDir = path.dirname(filePath);

    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, file.content);
      console.log(`Created file: ${filePath}`);
    } else {
      console.log(`File already exists: ${filePath}`);
    }
  });

  console.log("SOLID structure has been created successfully.");
}

// Mendapatkan base path (direktori di mana perintah dijalankan)
const basePath = process.cwd();
createSolidStructure(basePath);
