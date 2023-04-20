import * as bcryptUtil from '../bcypt.util';

jest.mock('bcrypt', () => ({
  genSalt: () => Promise.resolve('salt'),
  hash: () => Promise.resolve('hash'),
  compare: () => Promise.resolve(true),
}));

afterAll(() => {
  jest.resetModules();
});

describe('hash', () => {
  it('Should hash success', async () => {
    const result = await bcryptUtil.hash('str');

    expect(result).toEqual('hash');
  });
});

describe('compare', () => {
  it('Should compare success', async () => {
    const result = await bcryptUtil.compare('str', 'hashed');

    expect(result).toBeTruthy();
  });
});
