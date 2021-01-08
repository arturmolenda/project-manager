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
import axios from 'axios';

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

export const logout = () => async (dispatch) => {
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
  } catch (error) {
    localStorage.removeItem('userInfo');
    dispatch({ type: USER_LOGOUT });
    console.error(error);
  }
};
