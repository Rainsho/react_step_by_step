export default function(state = 1, action) {
  // console.info(action);
  switch (action.type) {
    case 'ADD_COUNT':
      return state + 1;
    case 'RECEIVE_COUNT':
      return action.payload;
    default:
      return state;
  }
}
