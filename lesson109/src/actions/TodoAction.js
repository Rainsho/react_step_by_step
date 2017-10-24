import { LOGIN, LOGOUT, ADD_TODO, MARK_TODO, DELETE_TODO } from '../constants/ActionTypes';

export function login(name,pswd){
  return {
      type: LOGIN,
      payload: {
        name, pswd,
      },
    }
}

export const logout = { type: LOGOUT }
