import { LOGIN, LOGOUT } from '../constants';

export function login(name, pswd) {
  return { type: LOGIN, payload: { name, pswd } };
}

export function logout() {
  return { type: LOGOUT };
}
