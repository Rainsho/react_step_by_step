// 当前 node -v : v10.5.0

// yield call() 伪实现
function* gen() {
  console.log('start gen');
  const result = yield requestAsync();
  console.log(result);
}

const g = gen();

function requestAsync() {
  console.log('start request');
  new Promise(res => setTimeout(res, 2000, Math.random())).then(result => g.next(result));
}

console.log('before gen');

g.next();

// co 伪实现
function co(gen) {
  return new Promise((resolve, reject) => {
    const g = gen();

    onFulfilled();

    function onFulfilled(res) {
      let ret;
      try {
        ret = g.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    function next(ret) {
      if (ret.done) return resolve(ret.value);
      return ret.value.then(onFulfilled);
    }
  });
}

co(function*() {
  const res1 = yield new Promise(res => setTimeout(res, 2500, 10));
  console.log(res1);
  const res2 = yield new Promise(res => setTimeout(res, 500, res1 + 10));
  console.log(res2);
  const res3 = yield new Promise(res => setTimeout(res, 500, res2 + 10));
  console.log(res3);
});
