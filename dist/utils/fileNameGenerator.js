"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandShortFileName = expandShortFileName;
const path = __importStar(require("path"));
function expandShortFileName(fileName) {
    // Mapping untuk konversi nama pendek ke panjang untuk berbagai framework
    const patterns = {
        // Laravel Blade
        '.b.p': '.blade.php',
        '.b.php': '.blade.php',
        // Ruby on Rails
        '.e.rb': '.html.erb',
        '.erb.h': '.html.erb',
        // React/Next.js
        '.j.tsx': '.jsx.tsx',
        '.tsx.c': '.component.tsx',
        '.p.tsx': '.page.tsx',
        // Vue.js
        '.v.js': '.vue.js',
        '.v.c': '.vue.component.js',
        // Angular
        '.c.ts': '.component.ts',
        '.s.ts': '.service.ts',
        '.m.ts': '.module.ts',
        // Svelte
        '.s.svelte': '.svelte',
        // PHP Templates
        '.t.php': '.template.php',
        // Django/Python
        '.d.py': '.django.py',
        '.v.py': '.view.py',
        '.t.py': '.template.py'
    };
    let expandedName = fileName;
    for (const [shortVersion, fullVersion] of Object.entries(patterns)) {
        if (fileName.toLowerCase().endsWith(shortVersion)) {
            const baseName = path.basename(fileName, shortVersion);
            expandedName = `${baseName}${fullVersion}`;
            break;
        }
    }
    return expandedName;
}
//# sourceMappingURL=fileNameGenerator.js.map