import os from 'os';
import path from 'path';
import { createWriteStream, WriteStream } from 'fs';

export function writeFileToTempDir(file: Express.Multer.File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileName = `${new Date().valueOf()}-${file.originalname}`;
    const uploadPath: string = path.join(os.tmpdir(), fileName);
    const writeStream: WriteStream = createWriteStream(uploadPath);
    writeStream.write(file.buffer);
    writeStream.end();
    writeStream.on('finish', () => resolve(uploadPath));
    writeStream.on('error', (err: Error) => reject(err));
  });
}
