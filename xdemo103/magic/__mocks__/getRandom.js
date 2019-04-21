// let getRandom = jest.genMockFromModule('../getRandom');

// let num = 0;

// getRandom.mockImplementation(() => num);

// getRandom.__set = function(_num) {
//   num = _num;
// };

// export default { getRandom };

//__mocks__/getRandom.js

// const rnd = jest.genMockFromModule('../getRandom');

// let num = 0;
// console.log(num);
// rnd.getRandom = () => 0;
// rnd.__set = function(_num) {
//   num = _num;
// };
// export default rnd;

let num = 0;
function getRandom() {
  return num;
}
getRandom.__set = function(_num) {
  num = _num;
};
export default getRandom;
