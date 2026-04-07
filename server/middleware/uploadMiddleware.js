// server/middleware/uploadMiddleware.js
import multer from "multer";

const storage = multer.memoryStorage();

// 50 MB cap — enough for a 20,000+ row CSV.
// Matches the express.json / urlencoded limit set in server.js.
export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50 MB
});
