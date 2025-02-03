#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const cliProgress = require("cli-progress");
const { type } = require("os");

// Progress bar
const progressBar = new cliProgress.SingleBar({
  format: "⚙️  Progress | {bar} | {percentage}% | {value}/{total} tasks",
  barCompleteChar: "\u2588",
  barIncompleteChar: "\u2591",
  hideCursor: true,
});

// Ambil nama entity dari argumen CLI
const entityName = process.argv[2];
if (!entityName) {
  console.error(
      "❌ Iam Sorry! Please provide an entity name. Usage: node coders-crud.js <EntityName>"
  );
  process.exit(1);
}

// Konversi ke format PascalCase dan snake_case
const pascalCase = entityName.charAt(0).toUpperCase() + entityName.slice(1);
const snakeCase = entityName
  .replace(/([A-Z])/g, "_$1")
  .toLowerCase()
  .replace(/^_/, ""); // Hapus underscore awal jika ada

// Paths dasar
const basePath = process.cwd();
const resourcesPath = path.join("resources", "views");

// Struktur file yang akan dibuat
const tasks = [
  {
    type: "migration",
    path: `database/migrations/${new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .slice(0, 14)}_create_${snakeCase}s_table.php`,
    template: migrationTemplate,
  },
  {
    type: "model",
    path: `app/Models/${pascalCase}.php`,
    template: modelTemplate,
  },
  {
    type: "controller",
    path: `app/Http/Controllers/${pascalCase}Controller.php`,
    template: controllerTemplate,
  },
  {
    type: "view",
    path: path.join(resourcesPath, `${snakeCase}/index.blade.php`),
    template: indexViewTemplate,
  },
  {
    type: "view",
    path: path.join(resourcesPath, `${snakeCase}/create.blade.php`),
    template: createViewTemplate,
  },
  {
    type: "view",
    path: path.join(resourcesPath, `${snakeCase}/edit.blade.php`),
    template: editViewTemplate,
  },
  {
    type: "view",
    path: path.join(resourcesPath, "Kerangka/master.blade.php"),
    template: masterLayoutTemplate,
  },
  {
    type: "route",
    path: "routes/web.php",
    template: routeTemplate,
  }
];

// Fungsi template
function migrationTemplate() {
  return `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

class Create${pascalCase}sTable extends Migration
{
    public function up()
    {
        Schema::create('${snakeCase}s', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('content');
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('${snakeCase}s');
    }
}`;
}

function modelTemplate() {
  return `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;

class ${pascalCase} extends Model
{
    use HasFactory;

    protected $fillable = ['name','content','image'];
}`;
}

function controllerTemplate() {
  return `<?php

namespace App\\Http\\Controllers;

use App\\Models\\${pascalCase};
use Illuminate\\Http\\Request;

class ${pascalCase}Controller extends Controller
{
    public function index()
    {
        $data = ${pascalCase}::all();
        return view('${snakeCase}.index', compact('data'));
    }

    public function create()
    {
        return view('${snakeCase}.create');
    }

    public function store(Request $request)
    {
        $data = $request->all();
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('images', 'public');
        }
        ${pascalCase}::create($data);
        return redirect()->route('${snakeCase}.index');
    }

    public function edit(${pascalCase} $${snakeCase})
    {
        return view('${snakeCase}.edit', compact('${snakeCase}'));
    }

    public function update(Request $request, ${pascalCase} $${snakeCase})
    {
        $data = $request->all();
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('images', 'public');
        }
        $${snakeCase}->update($data);
        return redirect()->route('${snakeCase}.index');
    }

    public function destroy(${pascalCase} $${snakeCase})
    {
        $${snakeCase}->delete();
        return redirect()->route('${snakeCase}.index');
    }
}`;
}

function indexViewTemplate() {
  return `@extends('Kerangka.master')

@section('content')
<div class="container mt-5">
    <h1 class="mb-4">${pascalCase} List</h1>
    <a href="{{ route('${snakeCase}.create') }}" class="btn btn-primary mb-3">Add New</a>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Content</th>
                <th>Image</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $item)
                <tr>
                    <td>{{ $item->id }}</td>
                    <td>{{ $item->name }}</td>
                    <td>{{ $item->content }}</td>
                    <td>
                        @if ($item->image)
                            <img src="{{ asset('storage/' . $item->image) }}" width="100" alt="Image">
                        @else
                            No Image
                        @endif
                    </td>
                    <td>
                        <a href="{{ route('${snakeCase}.edit', $item->id) }}" class="btn btn-warning btn-sm">Edit</a>
                        <form action="{{ route('${snakeCase}.destroy', $item->id) }}" method="POST" style="display:inline;">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection`;
}

function createViewTemplate() {
  return `@extends('Kerangka.master')

@section('content')
<div class="container mt-5">
    <h1 class="mb-4">Create ${pascalCase}</h1>
    <form action="{{ route('${snakeCase}.store') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <div class="form-group mb-3">
            <label for="name">Name</label>
            <input type="text" name="name" id="name" class="form-control" value="{{ old('name') }}" required>
        </div>
        <div class="form-group mb-3">
            <label for="content">Content</label>
            <input type="text" name="content" id="content" class="form-control" value="{{ old('content') }}" required>
        </div>
        <div class="form-group mb-3">
            <label for="image">Image</label>
            <input type="file" name="image" id="image" class="form-control">
        </div>
        <button type="submit" class="btn btn-success">Save</button>
    </form>
</div>
@endsection`;
}

function editViewTemplate() {
  return `@extends('Kerangka.master')

@section('content')
<div class="container mt-5">
    <h1 class="mb-4">Edit ${pascalCase}</h1>
    <form action="{{ route('${snakeCase}.update', $${snakeCase}->id) }}" method="POST" enctype="multipart/form-data">
        @csrf
        @method('PUT')
        <div class="form-group mb-3">
            <label for="name">Name</label>
            <input type="text" name="name" id="name" class="form-control" value="{{ old('name', $${snakeCase}->name) }}" required>
        </div>
        <div class="form-group mb-3">
            <label for="content">Content</label>
            <input type="text" name="content" id="content" class="form-control" value="{{ old('content', $${snakeCase}->content) }}" required>
        </div>
        <div class="form-group mb-3">
            <label for="image">Image</label>
            <input type="file" name="image" id="image" class="form-control">
            @if ($${snakeCase}->image)
                <img src="{{ asset('storage/' . $${snakeCase}->image) }}" width="100" alt="Image">
            @endif
        </div>
        <button type="submit" class="btn btn-success">Update</button>
    </form>
</div>
@endsection`;
}

function masterLayoutTemplate() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pascalCase} Management</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container">
        @yield('content')
    </div>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>`;
}
function routeTemplate() {
  return `
    Route::resource('${snakeCase}', ${pascalCase}Controller::class);
  `;
}

// Eksekusi tugas
progressBar.start(tasks.length, 0);
tasks.forEach((task, index) => {
  const filePath = path.join(basePath, task.path);
  const dirPath = path.dirname(filePath);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, task.template());
    console.log(`✅ Created: ${task.path}`);
  } else {
    console.log(`⚠️  Skipped: ${task.path} already exists.`);
  }

  progressBar.update(index + 1);
  if (index === tasks.length - 1) {
    progressBar.stop();
    console.log("✅ CRUD generated successfully!");
  }
});