import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "../dist/public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // 1. Serve files (css, js, images)
  app.use(express.static(distPath));

  // 2. Fallback to index.html for everything else (SPA Support)
  // We removed the "*" string here to fix the "Missing parameter name" error.
  app.use((_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}