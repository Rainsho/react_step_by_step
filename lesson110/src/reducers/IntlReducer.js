import { CHANGELOCALE } from '../constants';

export default function intlReducer(state = 'en', action) {
  switch (action.type) {
    case CHANGELOCALE:
      return action.payload;
    default:
      return state;
  }
}
