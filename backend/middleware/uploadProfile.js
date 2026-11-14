const multer = require("multer");
const path = require("path");
const fs = require("fs");
const root = process.env.UPLOADS_DIR ? path.join(process.env.UPLOADS_DIR, "uploads") : path.join(__dirname, "..", "uploads");
const directory = path.join(root, "profiles");
fs.mkdirSync(directory, { recursive: true });
const storage = multer.diskStorage({ destination: (_req, _file, cb) => cb(null, directory), filename: (_req, file, cb) => cb(null, `profile-${Date.now()}-${Math.round(Math.random()*1e9)}${path.extname(file.originalname).toLowerCase()}`) });
module.exports = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 }, fileFilter: (_req, file, cb) => ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype) ? cb(null, true) : cb(new Error("Only JPG, PNG, and WebP images are allowed.")) });
