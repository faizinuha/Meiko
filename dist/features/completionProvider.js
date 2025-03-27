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
exports.KawaiiCompletionProvider = void 0;
const vscode = __importStar(require("vscode"));
class KawaiiCompletionProvider {
    constructor() {
        this.cache = new Map();
    }
    async provideCompletionItems(document, position) {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        const fileContent = document.getText();
        const fileName = document.fileName;
        if (this.cache.has(fileName)) {
            return this.cache.get(fileName);
        }
        const suggestions = await this.generateSuggestions(fileContent, linePrefix, document.languageId);
        this.cache.set(fileName, suggestions);
        return suggestions;
    }
    async generateSuggestions(content, _currentLine, language) {
        const suggestions = [];
        const patterns = this.analyzeCodePatterns(content);
        for (const pattern of patterns) {
            const item = new vscode.CompletionItem(pattern.suggestion);
            item.kind = vscode.CompletionItemKind.Snippet;
            item.detail = pattern.description;
            item.documentation = new vscode.MarkdownString(pattern.documentation);
            suggestions.push(item);
        }
        this.addSnippetSuggestions(suggestions, language);
        return suggestions;
    }
    analyzeCodePatterns(_content) {
        return [];
    }
    addSnippetSuggestions(suggestions, language) {
        const snippets = this.getLanguageSnippets(language);
        suggestions.push(...snippets);
    }
    getLanguageSnippets(_language) {
        return [];
    }
}
exports.KawaiiCompletionProvider = KawaiiCompletionProvider;
//# sourceMappingURL=completionProvider.js.map