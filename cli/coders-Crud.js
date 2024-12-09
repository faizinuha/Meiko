#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const cliProgress = require("cli-progress");

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
  console.error("❌ Please provide an entity name. Usage: node coders-crud.js <EntityName>");
  process.exit(1);
}

// Konversi ke format PascalCase dan snake_case
const pascalCase = entityName.charAt(0).toUpperCase() + entityName.slice(1);
const snakeCase = entityName.replace(/([A-Z])/g, "_$1").toLowerCase().slice(1);

// Paths dasar
const basePath = process.cwd();
const resourcesPath = path.join(basePath, "resources", "views", snakeCase);

// Struktur file yang akan dibuat
const tasks = [
  { type: "migration", path: `database/migrations/create_${snakeCase}s_table.php`, template: migrationTemplate },
  { type: "model", path: `app/Models/${pascalCase}.php`, template: modelTemplate },
  { type: "controller", path: `app/Http/Controllers/${pascalCase}Controller.php`, template: controllerTemplate },
  { type: "view", path: `${resourcesPath}/index.blade.php`, template: indexViewTemplate },
  { type: "view", path: `${resourcesPath}/form.blade.php`, template: formViewTemplate },
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

    protected $fillable = ['name', 'image'];
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
        return view('${snakeCase}.form');
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
        return view('${snakeCase}.form', compact('${snakeCase}'));
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
  return `<div class="container mt-5">
    <h1 class="mb-4">${pascalCase} List</h1>
    <a href="{{ route('${snakeCase}.create') }}" class="btn btn-primary mb-3">Add New</a>
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Image</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($data as $item)
                <tr>
                    <td>{{ $item->id }}</td>
                    <td>{{ $item->name }}</td>
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
</div>`;
}

function formViewTemplate() {
  return `<div class="container mt-5">
    <h1 class="mb-4">{{ isset($${snakeCase}) ? 'Edit' : 'Create' }} ${pascalCase}</h1>
    <form action="{{ isset($${snakeCase}) ? route('${snakeCase}.update', $${snakeCase}->id) : route('${snakeCase}.store') }}" method="POST" enctype="multipart/form-data">
        @csrf
        @if (isset($${snakeCase}))
            @method('PUT')
        @endif
        <div class="form-group mb-3">
            <label for="name">Name</label>
            <input type="text" name="name" id="name" class="form-control" value="{{ old('name', $${snakeCase}->name ?? '') }}" required>
        </div>
        <div class="form-group mb-3">
            <label for="image">Image</label>
            <input type="file" name="image" id="image" class="form-control">
            @if (isset($${snakeCase}) && $${snakeCase}->image)
                <img src="{{ asset('storage/' . $${snakeCase}->image) }}" width="100" alt="Image">
            @endif
        </div>
        <button type="submit" class="btn btn-success">Save</button>
    </form>
</div>`;
}

// Eksekusi tugas
progressBar.start(tasks.length, 0);
tasks.forEach((task, index) => {
  const filePath = path.join(basePath, task.path);
  const dirPath = path.dirname(filePath);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  if (!fs.existsSync(filePath) || !task.append) {
    fs.writeFileSync(filePath, task.template());
  } else if (task.append) {
    fs.appendFileSync(filePath, task.template());
  }

  progressBar.update(index + 1);
  if (index === tasks.length - 1) {
    progressBar.stop();
    console.log("✅ CRUD generated successfully!");
  }
});
