it('mock callback function', async () => {
  const getDouble = (val, callback) =>
    new Promise(res => setTimeout(res, 100, val * 2)).then(callback);

  const mockCallback = jest.fn();

  getDouble(10, mockCallback);
  expect(mockCallback).not.toHaveBeenCalled();

  // 此处 await 结束后 上一次 getDouble 也执行完毕
  await getDouble(20, mockCallback);

  // mockCallback 执行了 2 次
  expect(mockCallback).toHaveBeenCalledTimes(2);

  // mockCallback 第一次执行时的第一个入参是 20
  expect(mockCallback.mock.calls[0][0]).toBe(20);

  // mockCallback 第一次执行时的第一个入参是 40
  expect(mockCallback.mock.calls[1][0]).toBe(40);
});

it('mock return', () => {
  const filterTestFn = jest.fn();

  // filterTestFn 前两次返回 true 之后返回 false
  filterTestFn
    .mockReturnValueOnce(true)
    .mockReturnValueOnce(true)
    .mockReturnValue(false);

  const result = [11, 12, 13, 14].filter(filterTestFn);

  expect(result).toEqual([11, 12]);
});

it('mock implementation', () => {
  const mockFn = jest.fn(() => 1);
  const mockImpl = jest.fn().mockImplementation(() => 2);

  expect(mockFn()).toEqual(1);
  expect(mockImpl()).toEqual(2);
});
