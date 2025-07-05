# AI Agent Code Generator (Fokus Laravel) - Dokumentasi Lengkap

## Deskripsi

AI Agent Code Generator ini adalah agen AI yang dirancang khusus untuk mempercepat pengembangan aplikasi Laravel. Agen ini mampu menghasilkan kode dan operasi CRUD (Create, Read, Update, Delete) secara otomatis berdasarkan perintah bahasa alami, dengan fokus pada praktik terbaik dan struktur yang umum digunakan dalam ekosistem Laravel.

## Fitur Utama

### 1. **Pemahaman Bahasa Alami**
- Memahami perintah dalam bahasa Indonesia dan Inggris yang relevan dengan pengembangan Laravel.
- Parsing otomatis untuk mengekstrak entitas (misalnya, `Product`, `User`), dan tipe kode (misalnya, `controller`, `model`, `crud`, `api`).
- Mendukung berbagai format perintah yang fleksibel.

### 2. **Generasi Kode Laravel**
- **Controller**: Menghasilkan Laravel Controller lengkap dengan metode CRUD (index, store, show, update, destroy) dan validasi dasar.
- **Model**: Menghasilkan Laravel Model dengan `HasFactory` dan `SoftDeletes`, serta properti `$fillable`, `$casts`, dan `$hidden` yang dapat disesuaikan.
- **Migration**: Menghasilkan file migrasi database dengan skema tabel dasar (id, name, description, status, timestamps, softDeletes).
- **Routes**: Menambahkan definisi `apiResource` ke `routes/api.php` untuk endpoint CRUD.

### 3. **Operasi CRUD Otomatis**
- Ketika Anda meminta `crud` untuk suatu entitas, agen akan secara otomatis menghasilkan Controller, Model, Migrasi, dan rute API yang diperlukan untuk operasi CRUD lengkap.

### 4. **Struktur Kode Profesional**
- Kode yang dihasilkan mengikuti konvensi dan praktik terbaik Laravel.
- Termasuk validasi data dasar pada Controller.
- Struktur file yang terorganisir dalam folder proyek yang dihasilkan.

## Cara Penggunaan

### Mode Command Line

Anda dapat menjalankan agen ini langsung dari terminal dengan memberikan perintah sebagai argumen:

```bash
# Membuat CRUD lengkap untuk entitas 'Product'
node ai-agent-generator.js "generate crud Product"

# Membuat controller spesifik untuk entitas 'User'
node ai-agent-generator.js "buat controller untuk User"

# Membuat model spesifik untuk entitas 'Order'
node ai-agent-generator.js "create model untuk Order"

# Membuat dokumentasi API untuk entitas 'Customer'
node ai-agent-generator.js "generate api untuk Customer"
```

### Mode Interaktif

Anda juga dapat menjalankan agen dalam mode interaktif, di mana Anda dapat memberikan beberapa perintah secara berurutan:

```bash
# Menjalankan mode interaktif
node ai-agent-generator.js

# Kemudian masukkan perintah Anda di prompt:
💬 Masukkan perintah Anda: buat crud untuk Product
💬 Masukkan perintah Anda: generate controller User
💬 Masukkan perintah Anda: exit
```

## Contoh Perintah yang Didukung

### Bahasa Indonesia
- "buat crud untuk Product"
- "generate controller untuk User"
- "bikin model untuk Order"
- "generate api untuk Customer"

### Bahasa Inggris
- "create crud for Product"
- "generate controller for User"
- "create model for Order"
- "generate api for Customer"

## Struktur Output

### Untuk CRUD Lengkap
Ketika Anda menjalankan perintah `crud`, agen akan membuat folder baru dengan nama entitas Anda (misalnya, `product-crud`) yang berisi struktur file berikut:

```
product-crud/
├── app/
│   ├── Models/
│   │   └── Product.php
│   └── Http/
│       └── Controllers/
│           └── ProductController.php
├── database/
│   └── migrations/
│       └── <timestamp>_create_products_table.php
└── routes/
    └── api.php
```

### Untuk Single Component (Controller, Model, API Docs)
Untuk perintah spesifik seperti `controller`, `model`, atau `api`, agen akan membuat file tunggal di direktori tempat Anda menjalankan perintah:
- `user-controller.php`
- `order-model.php`
- `customer-api-docs.md`

## Contoh Kode yang Dihasilkan

### Laravel Controller (Contoh: `ProductController.php`)
```php
<?php

namespace App\\Http\\Controllers;

use App\\Models\\Product;
use Illuminate\\Http\\Request;
use Illuminate\\Http\\JsonResponse;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $products = Product::all();
        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            // Tambahkan validasi lainnya sesuai kebutuhan
        ]);

        $product = Product::create($validatedData);

        return response()->json([
            'success' => true,
            'message' => 'Product berhasil dibuat',
            'data' => $product
        ], 201);
    }

    // ... metode CRUD lainnya (show, update, destroy)
}
```

### Laravel Model (Contoh: `Product.php`)
```php
<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'status',
        // Tambahkan field lainnya sesuai kebutuhan
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];
}
```

### Laravel Migration (Contoh: `<timestamp>_create_products_table.php`)
```php
<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('status')->default('active');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
```

## Kesimpulan

AI Agent Code Generator ini kini sepenuhnya berfokus pada ekosistem Laravel, menyediakan alat yang efisien dan terintegrasi untuk mempercepat pengembangan aplikasi Anda. Dengan kemampuan menghasilkan kode Laravel yang sesuai dengan praktik terbaik, agen ini akan menjadi aset berharga bagi para pengembang Laravel.

