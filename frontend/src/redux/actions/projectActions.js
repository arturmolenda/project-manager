import {
  PROJECT_CREATE_FAIL,
  PROJECT_CREATE_REQUEST,
  PROJECT_CREATE_SUCCESS,
  PROJECT_GET_DATA_FAIL,
  PROJECT_GET_DATA_REQUEST,
  PROJECT_GET_DATA_SUCCESS,
} from '../constants/projectConstants';
import axios from 'axios';
import { BACKGROUND_COLORS } from '../../util/colorsContants';

export const createProject = (title) => async (dispatch, getState) => {
  try {
    dispatch({ type: PROJECT_CREATE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    // set random background for new project
    const background =
      BACKGROUND_COLORS[Math.floor(Math.random() * Math.floor(6))];

    const { data } = await axios.post(
      '/api/projects/',
      { title, background },
      config
    );

    dispatch({ type: PROJECT_CREATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PROJECT_CREATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getProjectData = (projectId) => async (dispatch, getState) => {
  try {
    dispatch({ type: PROJECT_GET_DATA_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/projects/${projectId}`, config);
    console.log(data);
    dispatch({ type: PROJECT_GET_DATA_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PROJECT_GET_DATA_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
