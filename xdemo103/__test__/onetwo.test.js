import one from './one';
import onetwo from './onetwo';

jest.mock('./one');

describe('test mock', () => {
  it('test', () => {
    one.three.mockImplementation(() => 2);
    expect(onetwo()).toBe(4);
  });

  it('test 2', () => {
    one.three.mockReturnValue(3);
    expect(onetwo()).toBe(5);
  });
});
