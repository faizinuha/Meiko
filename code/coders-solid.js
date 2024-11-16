#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const cliProgress = require("cli-progress");

// Membuat progress bar
const progressBar = new cliProgress.SingleBar({
  format: 'Progress | {bar} | {percentage}%',
  barCompleteChar: '\u2588', // Karakter bar penuh
  barIncompleteChar: '\u2591', // Karakter bar kosong
  hideCursor: true,
  clearOnComplete:true
});

// Fungsi untuk membuat struktur SOLID
function createSolidStructure(basePath) {
  const directories = [
    "app/Entities",
    "app/Repositories",
    "app/Services",
    "app/Controllers",
    "app/Interfaces",
    "app/Http/Requests" 
  ];

  // Mulai progress bar
  progressBar.start(directories.length, 0);

  directories.forEach((dir, index) => {
    const dirPath = path.join(basePath, dir);

    // Simulasi delay untuk memperlihatkan loading bar (0.5 detik per folder)
    setTimeout(() => {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`Created folder: ${dirPath}`);
      } else {
        console.log(`Folder already exists: ${dirPath}`);
      }

      // Update progress bar
      progressBar.update(index + 1);

      // Hentikan progress bar setelah selesai
      if (index === directories.length - 1) {
        progressBar.stop();
        console.log("SOLID structure has been created successfully.");

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
 * Dependency Inversion Principle (DIP).
 * Repository ini berkomunikasi dengan Entity dan database.
 */
class ExampleRepository {
    public function findById($id) {
        // Contoh mendapatkan data dari database
        return new ExampleEntity($id, "Example Name");
    }

     public function findAll() {
        // Logika untuk mengambil semua entitas, bisa berupa array atau query database
        return [
            new ExampleEntity(1, "Entity One"),
            new ExampleEntity(2, "Entity Two"),
            new ExampleEntity(3, "Entity Three")
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
 * Service ini memproses data dan memisahkan tanggung jawab dengan Repository.
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
use App\\Http\\Requests\\ExampleRequest;

/**
 * Contoh Controller menggunakan prinsip SOLID.
 */
class ExampleController {
    private $service;

    public function __construct(ExampleService $service) {
        $this->service = $service;
    }

    public function index() {
        // Mendapatkan semua entitas dari service
        $entities = $this->service->getAllEntities();

        return json_encode($entities);
    }

    public function show(ExampleRequest $request) {
        // Mendapatkan ID yang divalidasi
        $validated = $request->validated();
        $entity = $this->service->getEntityById($validated['id']);
        
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
 * Liskov Substitution Principle (LSP).
 * Interface memungkinkan substitusi implementasi Repository tanpa mengubah Service.
 */
interface RepositoryInterface {
    public function findById($id);
}
`
    },
    {
      path: "app/Http/Requests/ExampleRequest.php", // Menambahkan file request validation
      content: `<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ExampleRequest extends FormRequest
{
    /**
     * Menentukan apakah pengguna berwenang untuk membuat permintaan ini.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Mendapatkan aturan validasi yang berlaku untuk permintaan ini.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'id' => 'required|integer|exists:entities,id', // Validasi ID
            'name' => 'required|string|max:255', // Validasi nama
        ];
    }
}
`
    }
  ];

  // Membuat file
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

  console.log("🔒:SOLID files have been created successfully.");
}

// Mendapatkan base path (direktori di mana perintah dijalankan)
const basePath = process.cwd();
createSolidStructure(basePath);
