
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadRoot = process.env.UPLOADS_DIR
    ? path.join(process.env.UPLOADS_DIR, "uploads")
    : path.join(__dirname, "..", "uploads");
const uploadDir = path.join(uploadRoot, "notes");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, {
        recursive: true
    });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9);

        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    }
});

const uploadNote = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

module.exports = uploadNote;

