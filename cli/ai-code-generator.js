#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const readline = require("readline");

// AI Agent untuk Code Generation (Fokus Laravel)
class AICodeAgent {
  constructor() {
    this.templates = {
      // Template untuk berbagai jenis kode Laravel
      controller: this.generateController.bind(this),
      model: this.generateModel.bind(this),
      crud: this.generateFullCRUD.bind(this),
      api: this.generateAPI.bind(this),
    };
    
    this.supportedLanguages = ["php", "laravel"];
  }

  // Parsing perintah natural language
  parseCommand(command) {
    const lowerCommand = command.toLowerCase();
    
    let entity = "DefaultEntity";
    let type = "crud";
    
    // Cari tipe terlebih dahulu
    const typeMatch = lowerCommand.match(/(controller|model|crud|api)/);
    if (typeMatch) {
      type = typeMatch[1];
    }
    
    // Cari entity
    const words = lowerCommand.split(" ");
    let entityCandidate = null;

    // Prioritaskan kata setelah 'untuk' atau 'for'
    for (let i = 0; i < words.length; i++) {
      if (["untuk", "for"].includes(words[i])) {
        if (words[i + 1] && /^[a-zA-Z]+$/.test(words[i + 1])) {
          entityCandidate = words[i + 1];
          break;
        }
      }
    }

    // Jika belum ditemukan, cari kata setelah tipe (controller, model, dll.)
    if (!entityCandidate) {
      for (let i = 0; i < words.length; i++) {
        if (["controller", "model", "crud", "api"].includes(words[i])) {
          if (words[i + 1] && /^[a-zA-Z]+$/.test(words[i + 1])) {
            entityCandidate = words[i + 1];
            break;
          }
        }
      }
    }

    // Fallback: jika masih belum ditemukan, ambil kata terakhir yang bukan keyword
    if (!entityCandidate) {
      const lastWord = words[words.length - 1];
      if (/^[a-zA-Z]+$/.test(lastWord) && !["crud", "controller", "model", "api", "php", "laravel", "untuk", "for"].includes(lastWord)) {
        entityCandidate = lastWord;
      }
    }

    if (entityCandidate) {
      entity = entityCandidate;
    }
    
    return {
      entity: entity,
      type: type,
      language: "laravel", // Default ke Laravel
      originalCommand: command
    };
  }

  // Generate Controller (Laravel PHP)
  generateController(entity) {
    const capitalizedEntity = entity.charAt(0).toUpperCase() + entity.slice(1);
    
    return `<?php\n\nnamespace App\\Http\\Controllers;\n\nuse App\\Models\\${capitalizedEntity};\nuse Illuminate\\Http\\Request;\nuse Illuminate\\Http\\JsonResponse;\n\nclass ${capitalizedEntity}Controller extends Controller\n{\n    /**\n     * Display a listing of the resource.\n     */\n    public function index(): JsonResponse\n    {\n        $${entity.toLowerCase()}s = ${capitalizedEntity}::all();\n        return response()->json([\n            \"success\" => true,\n            \"data\" => $${entity.toLowerCase()}s\n        ]);\n    }\n\n    /**\n     * Store a newly created resource in storage.\n     */\n    public function store(Request $request): JsonResponse\n    {\n        $validatedData = $request->validate([\n            \"name\" => \"required|string|max:255\",\n            // Tambahkan validasi lainnya sesuai kebutuhan\n        ]);\n\n        $${entity.toLowerCase()} = ${capitalizedEntity}::create($validatedData);\n\n        return response()->json([\n            \"success\" => true,\n            \"message\" => \"${capitalizedEntity} berhasil dibuat\",\n            \"data\" => $${entity.toLowerCase()}\n        ], 201);\n    }\n\n    /**\n     * Display the specified resource.\n     */\n    public function show(${capitalizedEntity} $${entity.toLowerCase()}): JsonResponse\n    {\n        return response()->json([\n            \"success\" => true,\n            \"data\" => $${entity.toLowerCase()}\n        ]);\n    }\n\n    /**\n     * Update the specified resource in storage.\n     */\n    public function update(Request $request, ${capitalizedEntity} $${entity.toLowerCase()}): JsonResponse\n    {\n        $validatedData = $request->validate([\n            \"name\" => \"sometimes|required|string|max:255\",\n            // Tambahkan validasi lainnya sesuai kebutuhan\n        ]);\n\n        $${entity.toLowerCase()}->update($validatedData);\n\n        return response()->json([\n            \"success\" => true,\n            \"message\" => \"${capitalizedEntity} berhasil diupdate\",\n            \"data\" => $${entity.toLowerCase()}\n        ]);\n    }\n\n    /**\n     * Remove the specified resource from storage.\n     */\n    public function destroy(${capitalizedEntity} $${entity.toLowerCase()}): JsonResponse\n    {\n        $${entity.toLowerCase()}->delete();\n\n        return response()->json([\n            \"success\" => true,\n            \"message\" => \"${capitalizedEntity} berhasil dihapus\"\n        ]);\n    }\n}`; 
  }

  // Generate Model (Laravel PHP)
  generateModel(entity) {
    const capitalizedEntity = entity.charAt(0).toUpperCase() + entity.slice(1);
    
    return `<?php\n\nnamespace App\\Models;\n\nuse Illuminate\\Database\\Eloquent\\Factories\\HasFactory;\nuse Illuminate\\Database\\Eloquent\\Model;\nuse Illuminate\\Database\\Eloquent\\SoftDeletes;\n\nclass ${capitalizedEntity} extends Model\n{\n    use HasFactory, SoftDeletes;\n\n    /**\n     * The attributes that are mass assignable.\n     *\n     * @var array<int, string>\n     */\n    protected $fillable = [\n        \"name\",\n        \"description\",\n        \"status\",\n        // Tambahkan field lainnya sesuai kebutuhan\n    ];\n\n    /**\n     * The attributes that should be cast.\n     *\n     * @var array<string, string>\n     */\n    protected $casts = [\n        \"created_at\" => \"datetime\",\n        \"updated_at\" => \"datetime\",\n        \"deleted_at\" => \"datetime\",\n    ];\n\n    /**\n     * The attributes that should be hidden for serialization.\n     *\n     * @var array<int, string>\n     */\n    protected $hidden = [\n        // Tambahkan field yang ingin disembunyikan\n    ];\n\n    // Tambahkan relationships, scopes, dan methods lainnya di sini\n}`; 
  }

  // Generate Full CRUD (Laravel PHP)
  generateFullCRUD(entity) {
    const capitalizedEntity = entity.charAt(0).toUpperCase() + entity.slice(1);
    
    const files = {
      [`app/Models/${capitalizedEntity}.php`]: this.generateModel(entity),
      [`app/Http/Controllers/${capitalizedEntity}Controller.php`]: this.generateController(entity),
      [`database/migrations/${new Date().toISOString().slice(0, 10).replace(/-/g, ".")}_create_${entity.toLowerCase()}s_table.php`]: this.generateMigration(entity),
      [`routes/api.php`]: this.generateRoutes(entity),
    };

    return files;
  }

  // Generate Migration (Laravel PHP)
  generateMigration(entity) {
    const capitalizedEntity = entity.charAt(0).toUpperCase() + entity.slice(1);
    
    return `<?php\n\nuse Illuminate\\Database\\Migrations\\Migration;\nuse Illuminate\\Database\\Schema\\Blueprint;\nuse Illuminate\\Support\\Facades\\Schema;\n\nreturn new class extends Migration\n{\n    /**\n     * Run the migrations.\n     */\n    public function up(): void\n    {\n        Schema::create(\'${entity.toLowerCase()}s\', function (Blueprint $table) {\n            $table->id();\n            $table->string(\'name\');\n            $table->text(\'description\')->nullable();\n            $table->string(\'status\')->default(\'active\');\n            $table->timestamps();\n            $table->softDeletes();\n        });\n    }\n\n    /**\n     * Reverse the migrations.\n     */\n    public function down(): void\n    {\n        Schema::dropIfExists(\'${entity.toLowerCase()}s\');\n    }\n};\n`;
  }

  // Generate Routes (Laravel PHP)
  generateRoutes(entity) {
    const capitalizedEntity = entity.charAt(0).toUpperCase() + entity.slice(1);
    
    return `\nRoute::apiResource(\'${entity.toLowerCase()}s\', App\\Http\\Controllers\\${capitalizedEntity}Controller::class);\n`;
  }

  // Generate API Documentation (Markdown)
  generateAPI(entity) {
    const capitalizedEntity = entity.charAt(0).toUpperCase() + entity.slice(1);
    
    return `# ${capitalizedEntity} API Documentation\n\n## Base URL\n\`\`\`\n/api\n\`\`\`\n\n## Endpoints\n\n### 1. Get All ${capitalizedEntity}s\n- **Method:** GET\n- **URL:** \`/${entity.toLowerCase()}s\`\n- **Description:** Retrieve all ${entity.toLowerCase()}s\n\n**Response:**\n\`\`\`json\n{\n  \"success\": true,\n  \"data\": [\n    {\n      \"id\": 1,\n      \"name\": \"Sample ${capitalizedEntity}\",\n      \"description\": \"Sample description\",\n      \"status\": \"active\",\n      \"created_at\": \"2024-01-01T00:00:00.000000Z\",\n      \"updated_at\": \"2024-01-01T00:00:00.000000Z\"\n    }\n  ]\n}\n\`\`\`\n\n### 2. Get ${capitalizedEntity} by ID\n- **Method:** GET\n- **URL:** \`/${entity.toLowerCase()}s/:id\`\n- **Description:** Retrieve a specific ${entity.toLowerCase()} by ID\n\n**Response:**\n\`\`\`json\n{\n  \"success\": true,\n  \"data\": {\n    \"id\": 1,\n    \"name\": \"Sample ${capitalizedEntity}\",\n    \"description\": \"Sample description\",\n    \"status\": \"active\",\n    \"created_at\": \"2024-01-01T00:00:00.000000Z\",\n    \"updated_at\": \"2024-01-01T00:00:00.000000Z\"\n  }\n}\n\`\`\`\n\n### 3. Create New ${capitalizedEntity}\n- **Method:** POST\n- **URL:** \`/${entity.toLowerCase()}s\`\n- **Description:** Create a new ${entity.toLowerCase()}\n\n**Request Body:**\n\`\`\`json\n{\n  \"name\": \"New ${capitalizedEntity}\",\n  \"description\": \"Description of the new ${entity.toLowerCase()}\",\n  \"status\": \"active\"\n}\n\`\`\`\n\n**Response:**\n\`\`\`json\n{\n  \"success\": true,\n  \"message\": \"${capitalizedEntity} berhasil dibuat\",\n  \"data\": {\n    \"id\": 2,\n    \"name\": \"New ${capitalizedEntity}\",\n    \"description\": \"Description of the new ${entity.toLowerCase()}\",\n    \"status\": \"active\",\n    \"created_at\": \"2024-01-01T00:00:00.000000Z\",\n    \"updated_at\": \"2024-01-01T00:00:00.000000Z\"\n  }\n}\n\`\`\`\n\n### 4. Update ${capitalizedEntity}\n- **Method:** PUT\n- **URL:** \`/${entity.toLowerCase()}s/:id\`\n- **Description:** Update an existing ${entity.toLowerCase()}\n\n**Request Body:**\n\`\`\`json\n{\n  \"name\": \"Updated ${capitalizedEntity}\",\n  \"description\": \"Updated description\"\n}\n\`\`\`\n\n**Response:**\n\`\`\`json\n{\n  \"success\": true,\n  \"message\": \"${capitalizedEntity} berhasil diupdate\",\n  \"data\": {\n    \"id\": 1,\n    \"name\": \"Updated ${capitalizedEntity}\",\n    \"description\": \"Updated description\",\n    \"status\": \"active\",\n    \"created_at\": \"2024-01-01T00:00:00.000000Z\",\n    \"updated_at\": \"2024-01-01T00:00:00.000000Z\"\n  }\n}\n\`\`\`\n\n### 5. Delete ${capitalizedEntity}\n- **Method:** DELETE\n- **URL:** \`/${entity.toLowerCase()}s/:id\`\n- **Description:** Delete a ${entity.toLowerCase()}\n\n**Response:**\n\`\`\`json\n{\n  \"success\": true,\n  \"message\": \"${capitalizedEntity} berhasil dihapus\"\n}\n\`\`\`\n\n## Error Responses\n\n### 400 Bad Request\n\`\`\`json\n{\n  \"success\": false,\n  \"message\": \"Validation failed: Name is required\"\n}\n\`\`\`\n\n### 404 Not Found\n\`\`\`json\n{\n  \"success\": false,\n  \"message\": \"${capitalizedEntity} tidak ditemukan\"\n}\n\`\`\`\n\n### 500 Internal Server Error\n\`\`\`json\n{\n  \"success\": false,\n  \"message\": \"Internal server error\"\n}\n\`\`\``;
  }

  // Process command dan generate code
  async processCommand(command) {
    const parsed = this.parseCommand(command);
    console.log(`\n🤖 AI Agent memproses perintah: "${command}"`);
    console.log(`📋 Parsed: Entity=${parsed.entity}, Type=${parsed.type}, Language=${parsed.language}`);

    const generator = this.templates[parsed.type];
    if (!generator) {
      throw new Error(`Tipe \'${parsed.type}\' tidak didukung. Tipe yang tersedia: ${Object.keys(this.templates).join(", ")}`);
    }

    const result = generator(parsed.entity);
    
    if (parsed.type === "crud") {
      // Untuk CRUD, buat multiple files
      const baseDir = path.join(process.cwd(), `${parsed.entity.toLowerCase()}-crud`);
      
      if (!fs.existsSync(baseDir)) {
        fs.mkdirSync(baseDir, { recursive: true });
      }

      Object.entries(result).forEach(([filePath, content]) => {
        const fullPath = path.join(baseDir, filePath);
        const dir = path.dirname(fullPath);
        
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(fullPath, content);
        console.log(`✅ File dibuat: ${fullPath}`);
      });

      console.log(`\n🎉 CRUD lengkap untuk ${parsed.entity} berhasil dibuat di folder: ${baseDir}`);
      return `CRUD lengkap untuk ${parsed.entity} berhasil dibuat`;
    } else if (parsed.type === "api") {
      const fileName = `${parsed.entity.toLowerCase()}-api-docs.md`;
      const filePath = path.join(process.cwd(), fileName);
      fs.writeFileSync(filePath, result);
      console.log(`✅ File dibuat: ${filePath}`);
      return `Dokumentasi API untuk ${parsed.entity} berhasil dibuat: ${fileName}`;
    } else {
      // Untuk single file (controller, model)
      const fileName = `${parsed.entity.toLowerCase()}-${parsed.type}.php`;
      const filePath = path.join(process.cwd(), fileName);
      
      fs.writeFileSync(filePath, result);
      console.log(`✅ File dibuat: ${filePath}`);
      
      return `${parsed.type} untuk ${parsed.entity} berhasil dibuat: ${fileName}`;
    }
  }

  // Interactive mode
  async startInteractiveMode() {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log(`\n🤖 AI Code Agent - Mode Interaktif (Fokus Laravel)\n=====================================\n\nContoh perintah yang bisa Anda gunakan:\n• \"buat controller untuk User\"\n• \"generate crud untuk Product\"\n• \"create model untuk Order\"\n• \"generate api untuk Customer\"\n\nKetik \'exit\' untuk keluar.\n`);

    const askQuestion = () => {
      rl.question("\n💬 Masukkan perintah Anda: ", async (command) => {
        if (command.toLowerCase() === "exit") {
          console.log("👋 Terima kasih telah menggunakan AI Code Agent!");
          rl.close();
          return;
        }

        try {
          const result = await this.processCommand(command);
          console.log(`\n✨ ${result}`);
        } catch (error) {
          console.log(`\n❌ Error: ${error.message}`);
        }

        askQuestion();
      });
    };

    askQuestion();
  }
}

// Main execution
async function main() {
  const agent = new AICodeAgent();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Mode interaktif jika tidak ada argumen
    await agent.startInteractiveMode();
  } else {
    // Mode command line
    const command = args.join(" ");
    try {
      const result = await agent.processCommand(command);
      console.log(`\n✨ ${result}`);
    } catch (error) {
      console.error(`\n❌ Error: ${error.message}`);
      process.exit(1);
    }
  }
}

// Jalankan jika file ini dieksekusi langsung
if (require.main === module) {
  main();
}

module.exports = AICodeAgent;


