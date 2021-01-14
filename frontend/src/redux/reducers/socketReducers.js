import {
  SOCKET_CONNECT_SUCCESS,
  SOCKET_CONNECT_RESET,
} from '../constants/socketConstants';

export const socketConnectionReducer = (state = {}, action) => {
  switch (action.type) {
    case SOCKET_CONNECT_SUCCESS:
      return { socket: action.payload };
    case SOCKET_CONNECT_RESET:
      return {};
    default:
      return state;
  }
};
