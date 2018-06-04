export default {
  addCount: () => ({
    type: 'ADD_COUNT',
  }),
  findCount: () => ({
    type: 'FIND_COUNT',
  }),
  receiveCount: payload => ({
    type: 'RECEIVE_COUNT',
    payload,
  }),
};
