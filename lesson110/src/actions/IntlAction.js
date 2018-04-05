import { CHANGELOCALE } from '../constants';

export function changeLocale(e) {
  return { type: CHANGELOCALE, payload: e.target.value };
}
