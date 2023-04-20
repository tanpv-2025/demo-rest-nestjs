import * as appUtil from '../app.util';

describe('capitalize', () => {
  it('Should capitalize success', () => {
    expect(appUtil.capitalize('str')).toEqual('Str');
  });
});

describe('getKey', () => {
  it('Should get key success', () => {
    const result = appUtil.getKey(
      { key1: 'value1', key2: 'value2' },
      'value1',
    );

    expect(result).toEqual('key1');
  });

  it('Should return undefined', () => {
    const result = appUtil.getKey(
      { key1: 'value1', key2: 'value2' },
      'value3',
    );

    expect(result).toBeUndefined();
  });
});

describe('getObjectByKey', () => {
  it('Should get object by key success', () => {
    const obj = { key1: 'value1', key2: 'value2' };
    const result = appUtil.getObjectByKey(obj, 'key2');

    expect(result).toEqual([obj]);
  });

  it('Should return empty array', () => {
    const result = appUtil.getObjectByKey({ key1: 'value1' }, 'key3');

    expect(result).toEqual([]);
  });
});

describe('getObjectByValue', () => {
  it('Should get object by value success', () => {
    const obj = { key1: 'value1', key2: 'value2' };
    const result = appUtil.getObjectByValue(obj, 'value2');

    expect(result).toEqual(obj);
  });

  it('Should return undefined', () => {
    const result = appUtil.getObjectByValue({ key1: 'value1' }, 'value3');

    expect(result).toBeUndefined();
  });
});
