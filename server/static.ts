import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ✅ This recreates __dirname safely for your Vercel ES Module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function serveStatic(app: Express) {
  // We can now safely use __dirname just like we used to in older Node versions
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