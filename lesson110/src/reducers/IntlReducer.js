import { CHANGELOCALE } from '../constants';

export function intlReducer(state = 'zh', action) {
  switch (action.type) {
    case CHANGELOCALE:
      return action.payload;
    default:
      return state;
  }
}
