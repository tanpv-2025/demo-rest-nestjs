import os from 'os';
import path from 'path';
import * as fs from 'fs';

export function getFilePathFromFileName(fileName: string): string {
  return path.join(os.tmpdir(), `${new Date().valueOf()}-${fileName}`);
}

export function writeFileToTempDir(
  filePath: string,
  file: Express.Multer.File,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writeStream: fs.WriteStream = fs.createWriteStream(filePath);
    writeStream.write(file.buffer);
    writeStream.end();
    writeStream.on('finish', () => resolve(filePath));
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
