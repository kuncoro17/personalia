// src/middlewares/upload.ts
import multer from 'multer';

// simpan di folder uploads/docs
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/docs'); // pastikan folder sudah ada
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// middleware untuk multiple fields (kitas, visa, tabita)
export const uploadMiddleware = multer({ storage });
