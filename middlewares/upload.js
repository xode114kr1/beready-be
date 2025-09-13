const multer = require("multer");

const fileFilter = (_req, file, cb) => {
  const ok = /^image\/(png|jpe?g|gif|webp)$/i.test(file.mimetype);
  if (!ok) return cb(new Error("이미지 파일만 업로드 가능합니다."), false);
  cb(null, true);
};

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
