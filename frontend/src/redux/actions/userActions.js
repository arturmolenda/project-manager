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
  USER_NOTIFICATIONS_UPDATE,
  USER_PICTURE_UPDATE_REQUEST,
  USER_PICTURE_UPDATE_SUCCESS,
  USER_PICTURE_UPDATE_FAIL,
  USER_DATA_UPDATE,
  USER_PROJECT_BG_UPDATE_FAIL,
  USER_PROJECT_BG_UPDATE_SUCCESS,
  USER_PROJECT_BG_UPDATE_REQUEST,
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

    // connect to socket server
    const socket = io.connect(window && window.location.origin, {
      transports: ['websocket', 'polling', 'flashsocket'],
      auth: {
        authorization: `Bearer ${data.userInfo.token}`,
      },
    });
    socket.on('connect', () => {
      dispatch({ type: SOCKET_CONNECT_SUCCESS, payload: socket });
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
      socket.emit('join-notifications', { room: data.userInfo._id });
    });

    localStorage.setItem(
      'userInfo',
      JSON.stringify({ token: data.userInfo.token })
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
  // window.location = '/login'
  localStorage.removeItem('userInfo');
  dispatch({ type: USER_LOGOUT });
  socket.disconnect();
  dispatch({ type: SOCKET_CONNECT_RESET });
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
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await axios.get('/api/users', config);

    // connect to socket server
    const socket = io.connect(window && window.location.origin, {
      transports: ['websocket', 'polling', 'flashsocket'],
      auth: {
        authorization: `Bearer ${data.userInfo.token}`,
      },
    });
    socket.on('connect', () => {
      dispatch({ type: SOCKET_CONNECT_SUCCESS, payload: socket });
      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
      socket.emit('join-notifications', { room: data.userInfo._id });
    });
  } catch (error) {
    localStorage.removeItem('userInfo');
    dispatch({ type: USER_LOGOUT });
  }
};

export const getUpdatedNotifications = () => async (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
  const { data } = await axios.get('/api/users/notifications', config);
  dispatch({ type: USER_NOTIFICATIONS_UPDATE, payload: data.notifications });
};

export const discardNotification = (
  notificationId,
  notificationIndex,
  callback
) => async (dispatch, getState) => {
  const {
    userLogin: { userInfo, notifications },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
  notifications.items.splice(notificationIndex, 1);
  dispatch({ type: USER_NOTIFICATIONS_UPDATE, payload: notifications });
  callback();
  await axios.delete(`/api/users/${notificationId}`, config);
};

export const markNotificationsSeen = () => async (dispatch, getState) => {
  const {
    userLogin: { userInfo, notifications },
  } = getState();

  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
  notifications.newNotificationsCount = 0;
  dispatch({ type: USER_NOTIFICATIONS_UPDATE, payload: notifications });
  await axios.put(`/api/users/markNotifications`, {}, config);
};

export const updateProfilePicture = (formData) => async (
  dispatch,
  getState
) => {
  try {
    const {
      userLogin: { userInfo },
    } = getState();
    dispatch({ type: USER_PICTURE_UPDATE_REQUEST });

    const config = {
      headers: {
        'Content-type': 'multipart/form-data',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    const { data } = await axios.post(`/api/images/upload`, formData, config);
    if (data.image) {
      const newImg = new Image();
      newImg.src = data.image;
      newImg.onload = () => {
        dispatch({ type: USER_PICTURE_UPDATE_SUCCESS, payload: data.image });
      };
    }
  } catch (error) {
    dispatch({
      type: USER_PICTURE_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateColorTheme = (color, projectId) => (dispatch, getState) => {
  const {
    userLogin: { userInfo },
  } = getState();

  if (userInfo.projectsThemes[projectId]) {
    userInfo.projectsThemes[projectId].mainColor = color;
  } else
    userInfo.projectsThemes = {
      ...userInfo.projectsThemes,
      [projectId]: { mainColor: color },
    };
  dispatch({ type: USER_DATA_UPDATE, payload: userInfo });

  const config = {
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
  axios.put('/api/users/projectColorTheme', { projectId, color }, config);
};

export const uploadProjectBgImage = (formData, projectId) => async (
  dispatch,
  getState
) => {
  try {
    const {
      userLogin: { userInfo },
    } = getState();
    dispatch({ type: USER_PROJECT_BG_UPDATE_REQUEST });

    const config = {
      headers: {
        'Content-type': 'multipart/form-data',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(
      `/api/images/upload/projectBgUpload/${projectId}`,
      formData,
      config
    );

    if (data.image) {
      const newImg = new Image();
      newImg.src = data.image;
      newImg.onload = () => {
        document.getElementById(
          'project-background'
        ).style.backgroundImage = `url(${data.image})`;
        dispatch({ type: USER_PROJECT_BG_UPDATE_SUCCESS });
        userInfo.projectsThemes[projectId].background = data.image;
        dispatch({ type: USER_DATA_UPDATE, payload: userInfo });
      };
    }
  } catch (error) {
    dispatch({
      type: USER_PROJECT_BG_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateProjectBgColor = (background, projectId) => (
  dispatch,
  getState
) => {
  const {
    userLogin: { userInfo },
  } = getState();
  document.getElementById(
    'project-background'
  ).style.backgroundImage = background;
  if (userInfo.projectsThemes[projectId]) {
    userInfo.projectsThemes[projectId].background = background;
  } else
    userInfo.projectsThemes = {
      ...userInfo.projectsThemes,
      [projectId]: { background: background },
    };
  dispatch({ type: USER_DATA_UPDATE, payload: userInfo });

  const config = {
    headers: {
      'Content-type': 'application/json',
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
  axios.put(
    '/api/users/projectBgColorTheme',
    { projectId, background },
    config
  );
};
