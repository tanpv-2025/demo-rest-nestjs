import fs from 'fs';
import fsPromises from 'fs/promises';

import * as fileUtil from '../file.util';

describe('getFilePathFromFileName', () => {
  it('Should get path success', () => {
    const result = fileUtil.getFilePathFromFileName('file.jpeg');

    expect(result).toMatch(/\/tmp\/\d+-file\.jpeg/);
  });
});

describe('writeFileToTempDir', () => {
  const filePath = '/tmp/file.jpeg';
  const file = { buffer: Buffer.from('test') } as any;

  jest.mock('fs');

  afterAll(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('Should write file success', async () => {
    jest.spyOn(fs, 'createWriteStream').mockReturnValue({
      write: jest.fn(),
      end: jest.fn(),
      on: jest.fn().mockImplementation(function(this, event, handler) {
        if (event === 'finish') {
          handler();
        }
        return this;
      }),
    } as any);

    await expect(fileUtil.writeFileToTempDir(filePath, file))
      .resolves
      .toEqual(filePath);
  });

  it('Should write file failed', async () => {
    jest.spyOn(fs, 'createWriteStream').mockReturnValue({
      write: jest.fn(),
      end: jest.fn(),
      on: jest.fn().mockImplementation(function(this, event, handler) {
        if (event === 'error') {
          handler(new Error('Something went wrong'));
        }
        return this;
      }),
    } as any);

    await expect(fileUtil.writeFileToTempDir(filePath, file))
      .rejects
      .toThrow('Something went wrong');
  });
});

describe('removeFileFromPath', () => {
  const filePath = '/tmp/file.jpeg';

  jest.mock('fs/promises');

  afterAll(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('Should remove file success', async () => {
    jest.spyOn(fsPromises, 'access').mockImplementation(
      () => Promise.resolve(),
    );
    jest.spyOn(fsPromises, 'unlink').mockImplementation(
      () => Promise.resolve(),
    );

    await expect(fileUtil.removeFileFromPath(filePath))
      .resolves
      .toBeUndefined();
  });

  it('Should remove file failed', async () => {
    jest.spyOn(fsPromises, 'access').mockImplementation(
      () => Promise.resolve(),
    );
    jest.spyOn(fsPromises, 'unlink').mockImplementation(
      () => Promise.reject(),
    );

    await expect(fileUtil.removeFileFromPath(filePath))
      .rejects
      .toThrow('Remove file failed');
  });
});
