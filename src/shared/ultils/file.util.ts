import os from 'os';
import path from 'path';
import * as fs from 'fs';

export function writeFileToTempDir(file: Express.Multer.File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileName = `${new Date().valueOf()}-${file.originalname}`;
    const uploadPath: string = path.join(os.tmpdir(), fileName);
    const writeStream: fs.WriteStream = fs.createWriteStream(uploadPath);
    writeStream.write(file.buffer);
    writeStream.end();
    writeStream.on('finish', () => resolve(uploadPath));
    writeStream.on('error', (err: Error) => reject(err));
  });
}

export async function removeFileFromPath(filePath: string): Promise<void> {
  try {
    await fs.promises.access(filePath);
    await fs.promises.unlink(filePath);
  } catch (error) {
    throw new Error('Remove file failed');
  }
}
