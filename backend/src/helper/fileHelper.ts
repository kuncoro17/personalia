// src/helpers/fileHelper.ts
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';

export const BASE_URL =
  process.env.BASE_DOC_URL || 'http://localhost:3000/uploads/docs';

export const getFileUrl = (filename: string) => `${BASE_URL}/${filename}`;

export const deleteLocalFile = (fileUrl: string | null) => {
  if (!fileUrl) return;
  const relativePath = fileUrl.replace(BASE_URL + '/', '');
  const filePath = path.join(__dirname, '../uploads/docs', relativePath);

  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
};

// Generic interface for file upload (suitable for Hono + multer memory storage)
export interface UploadedFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

export const uploadFile = async (file: UploadedFile, filename: string) => {
  // sanitize filename
  const safeFilename = path.basename(filename);
  const filePath = path.join('./uploads/docs', safeFilename);

  await fsPromises.writeFile(filePath, file.buffer);
  return getFileUrl(safeFilename);
};

export const saveFile = uploadFile;
