export default function(action$) {
  // console.log(action$);
  return action$
    .ofType('FIND_COUNT')
    .delay(1000)
    .mapTo({ type: 'RECEIVE_COUNT', payload: 99 });
}
