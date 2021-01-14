import {
  USER_EMAIL_CONFIRM_FAIL,
  USER_EMAIL_CONFIRM_REQUEST,
  USER_EMAIL_CONFIRM_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_EMAIL_RESEND_REQUEST,
  USER_EMAIL_RESEND_SUCCESS,
  USER_EMAIL_RESEND_FAIL,
} from '../constants/userConstants';
import {
  SOCKET_CONNECT_RESET,
  SOCKET_CONNECT_SUCCESS,
} from '../constants/socketConstants';
import axios from 'axios';
import io from 'socket.io-client';

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    const { data } = await axios.post(
      '/api/users/login',
      { email, password },
      config
    );

    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem('userInfo', JSON.stringify({ token: data.token }));

    // connect to socket server
    const socket = io.connect('http://localhost:5000', {
      transports: ['websocket', 'polling', 'flashsocket'],
      auth: {
        headers: {
          authorization: `Bearer ${data.token}`,
        },
      },
    });
    socket.on('connect', () =>
      dispatch({ type: SOCKET_CONNECT_SUCCESS, payload: socket })
    );
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const register = (username, email, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_REGISTER_REQUEST });

    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    const { data } = await axios.post(
      '/api/users/register',
      { username, email, password },
      config
    );
    dispatch({ type: USER_REGISTER_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_REGISTER_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const logout = () => async (dispatch, getState) => {
  const {
    socketConnection: { socket },
  } = getState();
  socket.disconnect();
  dispatch({ type: SOCKET_CONNECT_RESET });
  localStorage.removeItem('userInfo');
  dispatch({ type: USER_LOGOUT });
};

export const confirmEmail = (emailCode) => async (dispatch) => {
  try {
    dispatch({ type: USER_EMAIL_CONFIRM_REQUEST });

    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    const { data } = await axios.post(
      '/api/users/confirm',
      { emailCode },
      config
    );
    dispatch({ type: USER_EMAIL_CONFIRM_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_EMAIL_CONFIRM_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const resendEmail = (emailCode) => async (dispatch) => {
  try {
    dispatch({ type: USER_EMAIL_RESEND_REQUEST });

    const config = {
      headers: { 'Content-Type': 'application/json' },
    };
    const { data } = await axios.post(
      '/api/users/resend',
      { emailCode },
      config
    );
    dispatch({ type: USER_EMAIL_RESEND_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: USER_EMAIL_RESEND_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getUserData = (token) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get('/api/users/', config);
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });

    // connect to socket server
    const socket = io.connect('http://localhost:5000', {
      transports: ['websocket', 'polling', 'flashsocket'],
      auth: {
        headers: {
          authorization: `Bearer ${data.token}`,
        },
      },
    });
    socket.on('connect', () =>
      dispatch({ type: SOCKET_CONNECT_SUCCESS, payload: socket })
    );
  } catch (error) {
    localStorage.removeItem('userInfo');
    dispatch({ type: USER_LOGOUT });
    console.error(error);
  }
};
