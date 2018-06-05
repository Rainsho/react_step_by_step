import { add, add as sum } from './sum';

it('jest test', async () => {
  expect(add(1, 2)).toBe(3);

  // setTimeout(10000);
  // jest.setTimeout(10000);
  // await new Promise(res => setTimeout(res, 5000));

  expect(add(1, 2)).toBe(3);
});

it('common expect', () => {
  // toBe 调用 Object.is 进行比较
  expect(sum(1, 2)).toBe(3);

  // toEqual 递归检查对象或数组字段
  const data = { one: 1 };
  data.two = 2;
  expect(data).toEqual({ one: 1, two: 2 });

  // number
  expect(sum(0.1, 0.2)).not.toBe(0.3);
  expect(sum(0.1, 0.2)).toBeCloseTo(0.3);
  expect(2 + 2).toBeGreaterThan(3);
  expect(2 + 2).toBeGreaterThanOrEqual(3.5);
  expect(2 + 2).toBeLessThan(5);
  expect(2 + 2).toBeLessThanOrEqual(4.5);

  // null or undefined
  expect(null).toBeNull();
  expect(null).not.toBeTruthy();
  expect(null).toBeFalsy();

  // string
  expect('douyu').toMatch(/yu/);

  // array
  const todoList = ['eat', 'play', 'sleep'];
  expect(todoList).toContain('sleep');

  // Promise
  expect(Promise.resolve('problem')).resolves.toBe('problem');
  expect(Promise.reject('assign')).rejects.toBe('assign');

  // error
  const wrong = () => {
    throw new Error('something went wrong');
  };
  expect(wrong).toThrow('something went wrong');
});

const fetchData = () => new Promise(res => setTimeout(res, 0, 'got some data'));

it('promise test', () => {
  // 使用 assertions 验证该用例下断言执行的次数
  expect.assertions(1);

  // 必须返回 Promise 对象 否则测试将在 fetchData 完成之前完成
  return fetchData().then(data => {
    expect(data).toBe('got some data');
  });
});

it('promise.resolve test', () => {
  // 也可以使用 .resolves | .rejects 声明期望
  return expect(fetchData()).resolves.toBe('got some data');
});

it('async test', async () => {
  const fetchData = () => new Promise(res => setTimeout(res, 0, 'got some data'));
  const data = await fetchData();

  expect(data).toBe('got some data');
});
