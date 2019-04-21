import getRandom from './getRandom';
import createModule from './createModule';

jest.mock('./getRandom');

describe('test mock', () => {
  it('test', () => {
    getRandom.__set(100);
    const module = createModule('module');
    expect(module.id).toBe('module-100');
  });
});
