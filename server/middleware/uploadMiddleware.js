// server/middleware/uploadMiddleware.js
import multer from "multer";

const storage = multer.memoryStorage();

// No file size limit for now (simpler while developing)
// If you want, you can later add: limits: { fileSize: 20 * 1024 * 1024 }
export const upload = multer({ storage });
