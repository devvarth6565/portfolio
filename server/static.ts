import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// --- FIX 1: Manually create __dirname for ES Modules ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function serveStatic(app: Express) {
  // --- FIX 2: Point to the correct 'dist' folder ---
  // We go up one level (..) because this file is in 'server/',
  // but the build output is usually in 'dist/public'
  const distPath = path.resolve(__dirname, "../dist/public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // --- FIX 3: Use standard Express wildcard matching ---
  // Fall through to index.html for any route not handled by API
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}