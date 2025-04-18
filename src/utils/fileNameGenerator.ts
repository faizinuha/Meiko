import * as path from "path";
export function expandShortFileName(
  fileName: string,
  customMappings: { [key: string]: string }
): string {
  const defaultPatterns: { [key: string]: string } = {
    ".b.p": ".blade.php",
    ".b.php": ".blade.php",

    // Ruby on Rails
    ".e.rb": ".html.erb",
    ".erb.h": ".html.erb",

    // React/Next.js
    ".j.tsx": ".jsx.tsx",
    ".tsx.c": ".component.tsx",
    ".p.tsx": ".page.tsx",

    // Vue.js
    ".v.js": ".vue.js",
    ".v.c": ".vue.component.js",

    // Angular
    ".c.ts": ".component.ts",
    ".s.ts": ".service.ts",
    ".m.ts": ".module.ts",

    // Svelte
    ".s.svelte": ".svelte",

    // PHP Templates
    ".t.php": ".template.php",

    // Django/Python
    ".d.py": ".django.py",
    ".v.py": ".view.py",
    ".t.py": ".template.py",
    // ... tambahkan mapping default lainnya
  };

  const patterns = { ...defaultPatterns, ...customMappings }; // Gabungkan mapping default dan custom

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
