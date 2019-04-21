export default function(action$) {
  // console.log(action$);
  return action$
    .ofType('FIND_COUNT')
    .delay(800)
    .mapTo({ type: 'RECEIVE_COUNT', payload: 99 });
}
