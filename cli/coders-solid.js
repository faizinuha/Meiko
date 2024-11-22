#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const cliProgress = require("cli-progress");

// Membuat progress bar
const progressBar = new cliProgress.SingleBar({
  format: '📂 Progress | {bar} | {percentage}% | {value}/{total} directories',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true
});

// Fungsi untuk membuat struktur SOLID
function createSolidStructure(basePath) {
  const directories = [
    "app/Entities",
    "app/Repositories",
    "app/Services",
    "app/Controllers",
    "app/Interfaces",
    "app/Traits",
    "app/Enums",
    "app/Http/Requests"
  ];

  console.log("🚀 Starting to create SOLID folder structure...\n");
  
  // Mulai progress bar
  progressBar.start(directories.length, 0);

  directories.forEach((dir, index) => {
    const dirPath = path.join(basePath, dir);

    // Simulasi delay untuk memperlihatkan loading bar
    setTimeout(() => {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`✅ Folder created: ${dirPath}`);
      } else {
        console.log(`📁 Folder already exists: ${dirPath}`);
      }

      // Update progress bar
      progressBar.update(index + 1);

      // Hentikan progress bar setelah selesai
      if (index === directories.length - 1) {
        progressBar.stop();
        console.log("\n✅ SOLID folder structure has been created successfully!\n");

        // Membuat file PHP sesuai prinsip SOLID
        createSolidFiles(basePath);
      }
    }, 500 * index); // Delay 0.5 detik per iterasi
  });
}

// Fungsi untuk membuat file contoh SOLID
function createSolidFiles(basePath) {
  const files = [
    {
      path: "app/Entities/ExampleEntity.php",
      content: `<?php
namespace App\\Entities;

/**
 * Single Responsibility Principle (SRP).
 * Entity ini hanya bertugas menangani data.
 */
class ExampleEntity {
    private $id;
    private $name;

    public function __construct($id, $name) {
        $this->id = $id;
        this->name = $name;
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
 * Dependency Inversion Principle (DIP).
 * Repository ini berkomunikasi dengan Entity dan database.
 */
class ExampleRepository {
    public function findById($id) {
        return new ExampleEntity($id, "Example Name");
    }

    public function findAll() {
        return [
            new ExampleEntity(1, "Entity One"),
            new ExampleEntity(2, "Entity Two")
        ];
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
 * Interface Segregation Principle (ISP).
 */
class ExampleService {
    private $repository;

    public function __construct(ExampleRepository $repository) {
        $this->repository = $repository;
    }

    public function getEntityById($id) {
        return $this->repository->findById($id);
    }

    public function getAllEntities() {
        return $this->repository->findAll();
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
 * Contoh Controller menggunakan prinsip SOLID.
 */
class ExampleController {
    private $service;

    public function __construct(ExampleService $service) {
        $this->service = $service;
    }

    public function index() {
        $entities = $this->service->getAllEntities();
        return json_encode($entities);
    }
}
`
    },
    {
      path: "app/Interfaces/RepositoryInterface.php",
      content: `<?php
namespace App\\Interfaces;

/**
 * Liskov Substitution Principle (LSP).
 */
interface RepositoryInterface {
    public function findById($id);
}
`
    },
    {
      path: "app/Http/Requests/ExampleRequest.php",
      content: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class ExampleRequest extends FormRequest {
    public function authorize() {
        return true;
    }

    public function rules() {
        return [
            'id' => 'required|integer'
        ];
    }
}
`
    },
    // TRAITS
    {
      path: "app/Traits/Uploadable.php",
      content: `<?php
namespace App\\Traits;

    /**  
     * Trait untuk menangani upload file. //EXAMPLE
     */
    trait Uploadable {
        public function uploadFile($file, $destination) {
            $filename = uniqid() . '_' . $file->getClientOriginalName();
            $file->move($destination, $filename);
            return $filename;
        }
    }
`
    },
     // Enum
     {
      path: "app/Enums/FileType.php",
      content: `<?php
      namespace App\\Enums;

      /**
       * Enum untuk tipe file yang didukung. //EXAMPLE
       */
      enum FileType: string {
          case IMAGE = 'image';
          case DOCUMENT = 'document';
          case VIDEO = 'video';
      }
`
    }
  ];

  console.log("📄 Starting to create SOLID files...\n");

  files.forEach((file, index) => {
    const filePath = path.join(basePath, file.path);
    const fileDir = path.dirname(filePath);

    // Membuat direktori jika belum ada
    if (!fs.existsSync(fileDir)) {
      fs.mkdirSync(fileDir, { recursive: true });
    }

    // Membuat file jika belum ada
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, file.content);
      console.log(`✅ File created: ${filePath}`);
    } else {
      console.log(`📄 File already exists: ${filePath}`);
    }

    // Simulasi delay untuk estetika
    setTimeout(() => {
      if (index === files.length - 1) {
        console.log("\n✅ All SOLID files have been created successfully!");
      }
    }, 200 * index);
  });
}

// Mendapatkan base path
const basePath = process.cwd();
createSolidStructure(basePath);
