const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const base = path.basename(file.originalname || "image", ext);
    cb(null, `${Date.now()}_${base}${ext || ".jpg"}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const ok = /^image\/(png|jpe?g|gif|webp)$/i.test(file.mimetype);
  if (!ok) return cb(new Error("이미지 파일만 업로드 가능합니다."), false);
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
