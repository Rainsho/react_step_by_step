import { CHANGELOCALE } from '../constants';

export default function changeLocale(e) {
  return { type: CHANGELOCALE, payload: e.target.value };
}
