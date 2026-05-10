import express from "express";

import cors from "cors";

import uploadRoutes
from "./routes/upload.route.js";

import chatRoutes from "./routes/chat.route.js";
import fs from "fs";

const app = express();

// Ensure uploads directory exists (Mandatory for Render/Railway)
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Global Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

app.use(cors());

app.use(express.json());

app.use(
  "/api/upload",
  uploadRoutes
);

app.use(
  "/api/chat",
  chatRoutes
);

export default app;