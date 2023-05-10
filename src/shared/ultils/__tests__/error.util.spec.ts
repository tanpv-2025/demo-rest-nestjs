import * as errorUtil from '../error.util';
import { ErrorDto } from '../../dtos/error.dto';

describe('internalServerError', () => {
  it('Should return correct value', () => {
    const result = errorUtil.internalServerError();

    expect(result).toBeInstanceOf(ErrorDto);
    expect(result).toMatchObject({
      code: 5000,
      message: 'INTERNAL_SERVER_ERROR',
    });
  });
});
