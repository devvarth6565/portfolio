import express, { type Express } from "express";
import fs from "fs";
import path from "path";

// ❌ Delete these lines:
// import { fileURLToPath } from "url";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

export function serveStatic(app: Express) {
  // ✅ Node.js CommonJS provides __dirname globally.
  // (Note: If TypeScript throws a red underline here, ensure you have `@types/node` installed, 
  // or simply add // @ts-ignore on the line above it).
  const distPath = path.resolve(__dirname, "../dist/public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // 1. Serve files (css, js, images)
  app.use(express.static(distPath));

  // 2. Fallback to index.html for everything else (SPA Support)
  app.use((_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}