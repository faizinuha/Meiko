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
    "app/Http/Requests",
      "resources/views/posts",
      "app/migration/0000_00_00_create_posts_table.php"
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
      // Migration
{
    path: "app/migration/0000_00_00_create_posts_table.php",
    content: `<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostsTable extends Migration {
    public function up() {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->timestamps();
        });
    }
    public function down() {
        Schema::dropIfExists('posts');
    }
}`
},
    // TRAITS
    {
      path: "app/Traits/Uploadable.php",
      content: `<?php
namespace App\\Traits;

/**  
 * Trait untuk menangani upload file.
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
 * Enum untuk tipe file yang didukung.
 */
enum FileType: string {
    case IMAGE = 'image';
    case DOCUMENT = 'document';
    case VIDEO = 'video';
}
`
    },
    // CRUD Example
    {
      path: "app/Controllers/PostController.php",
      content: `<?php
namespace App\\Controllers;

use App\\Services\\PostService;
use App\\Http\\Requests\\PostRequest;

/**
 * Contoh Controller untuk operasi CRUD.
 */
class PostController {
    private $service;

    public function __construct(PostService $service) {
        $this->service = $service;
    }

    public function index() {
        $entities = $this->service->getAllEntities();
        return view('posts.index', compact('entities'));
    }

    public function create() {
        return view('posts.create');
    }

    public function store(PostRequest $request) {
        $data = $request->validated();
        $entity = $this->service->create($data);
        return redirect()->route('posts.index')->with('success', 'Post created successfully.');
    }

    public function show($id) {
        $entity = $this->service->read($id);
        return view('posts.show', compact('entity'));
    }

    public function edit($id) {
        $entity = $this->service->read($id);
        return view('posts.edit', compact('entity'));
    }

    public function update(PostRequest $request, $id) {
        $data = $request->validated();
        $entity = $this->service->update($id, $data);
        return redirect()->route('posts.index')->with('success', 'Post updated successfully.');
    }

    public function destroy($id) {
        $this->service->delete($id);
        return redirect()->route('posts.index')->with('success', 'Post deleted successfully.');
    }
}
`
    },
    {
      path: "app/Services/PostService.php",
      content: `<?php
namespace App\\Services;

use App\\Repositories\\PostRepository;

/**
 * Service untuk operasi CRUD.
 */
class PostService {
    private $repository;

    public function __construct(PostRepository $repository) {
        $this->repository = $repository;
    }

    public function getAllEntities() {
        return $this->repository.findAll();
    }

    public function create($data) {
        return $this->repository.create($data);
    }

    public function read($id) {
        return $this->repository.findById($id);
    }

    public function update($id, $data) {
        return $this->repository.update($id, $data);
    }

    public function delete($id) {
        return $this->repository.delete($id);
    }
}
`
    },
    {
      path: "app/Repositories/PostRepository.php",
      content: `<?php
namespace App\\Repositories;

use App\\Entities\\PostEntity;

/**
 * Repository untuk operasi CRUD.
 */
class PostRepository {
    private $entities = [];

    public function findAll() {
        return $this->entities;
    }

    public function create($data) {
        $entity = new PostEntity(count($this->entities) + 1, $data['name']);
        $this->entities[] = $entity;
        return $entity;
    }

    public function findById($id) {
        foreach ($this->entities as $entity) {
            if ($entity.getId() == $id) {
                return $entity;
            }
        }
        return null;
    }

    public function update($id, $data) {
        foreach ($this->entities as $entity) {
            if ($entity.getId() == $id) {
                $entity.setName($data['name']);
                return $entity;
            }
        }
        return null;
    }

    public function delete($id) {
        foreach ($this->entities as $index => $entity) {
            if ($entity.getId() == $id) {
                unset($this->entities[$index]);
                return true;
            }
        }
        return false;
    }
}
`
    },
    {
      path: "app/Entities/PostEntity.php",
      content: `<?php
namespace App\\Entities;

/**
 * Entity untuk operasi CRUD.
 */
class PostEntity {
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

    public function setName($name) {
        $this->name = $name;
    }
}
`
    },
    {
      path: "app/Http/Requests/PostRequest.php",
      content: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class PostRequest extends FormRequest {
    public function authorize() {
        return true;
    }

    public function rules() {
        return [
            'name' => 'required|string|max:255'
        ];
    }
}
`
    },
    // Blade Views
    {
      path: "resources/views/posts/index.blade.php",
      content: `<!DOCTYPE html>
<html>
<head>
    <title>Posts</title>
</head>
<body>
    <h1>Posts</h1>
    <a href="{{ route('posts.create') }}">Create New Post</a>
    <ul>
        @foreach ($entities as $entity)
            <li>{{ $entity->getName() }} - <a href="{{ route('posts.edit', $entity->getId()) }}">Edit</a> - <form action="{{ route('posts.destroy', $entity->getId()) }}" method="POST" style="display:inline;">
                @csrf
                @method('DELETE')
                <button type="submit">Delete</button>
            </form></li>
        @endforeach
    </ul>
</body>
</html>
`
    },
    {
      path: "resources/views/posts/create.blade.php",
      content: `<!DOCTYPE html>
<html>
<head>
    <title>Create Post</title>
</head>
<body>
    <h1>Create Post</h1>
    <form action="{{ route('posts.store') }}" method="POST">
        @csrf
        <label for="name">Name:</label>
        <input type="text" id="name" name="name">
        <button type="submit">Create</button>
    </form>
</body>
</html>
`
    },
    {
      path: "resources/views/posts/edit.blade.php",
      content: `<!DOCTYPE html>
<html>
<head>
    <title>Edit Post</title>
</head>
<body>
    <h1>Edit Post</h1>
    <form action="{{ route('posts.update', $entity->getId()) }}" method="POST">
        @csrf
        @method('PUT')
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" value="{{ $entity->getName() }}">
        <button type="submit">Update</button>
    </form>
</body>
</html>
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
