import { PROJECT_DATA_TITLE_UPDATE } from '../constants/projectConstants';
import {
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_DATA_UPDATE,
  USER_LOGOUT,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_REGISTER_FAIL,
  USER_EMAIL_CONFIRM_REQUEST,
  USER_EMAIL_CONFIRM_SUCCESS,
  USER_EMAIL_CONFIRM_FAIL,
  USER_EMAIL_RESEND_REQUEST,
  USER_EMAIL_RESEND_SUCCESS,
  USER_EMAIL_RESEND_FAIL,
  USER_NOTIFICATIONS_UPDATE,
  USER_REMOVED,
  USER_PICTURE_UPDATE_REQUEST,
  USER_PICTURE_UPDATE_SUCCESS,
  USER_PICTURE_UPDATE_FAIL,
  USER_PROJECT_BG_UPDATE_REQUEST,
  USER_PROJECT_BG_UPDATE_SUCCESS,
  USER_PROJECT_BG_UPDATE_FAIL,
} from '../constants/userConstants';
import deepcopy from 'deepcopy';

export const userLoginReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case USER_LOGIN_REQUEST:
      return { ...state, loading: true };
    case USER_LOGIN_SUCCESS:
      return {
        loading: false,
        userInfo: action.payload.userInfo,
        notifications: action.payload.notifications,
      };
    case PROJECT_DATA_TITLE_UPDATE: {
      const {
        payload: { title, projectId },
      } = action;
      const stateClone = deepcopy(state.userInfo);
      stateClone.projectsCreated.map((x) => {
        if (x._id === projectId) x.title = title;
        return x;
      });
      stateClone.projectsJoined.map((x) => {
        if (x._id === projectId) x.title = title;
        return x;
      });

      return { ...state, userInfo: stateClone };
    }
    case USER_DATA_UPDATE:
      return { ...state, userInfo: action.payload };
    case USER_NOTIFICATIONS_UPDATE:
      return {
        ...state,
        notifications: action.payload,
      };
    case USER_REMOVED: {
      const stateClone = deepcopy(state.userInfo);
      if (action.payload.creator) {
        const projectIndex = stateClone.projectsCreated.findIndex(
          (x) => x._id === action.payload.projectId
        );
        stateClone.projectsCreated.splice(projectIndex, 1);
      } else {
        const projectIndex = stateClone.projectsJoined.findIndex(
          (x) => x._id === action.payload.projectId
        );
        stateClone.projectsJoined.splice(projectIndex, 1);
      }
      return { ...state, userInfo: stateClone };
    }
    case USER_PICTURE_UPDATE_SUCCESS: {
      return {
        ...state,
        userInfo: { ...state.userInfo, profilePicture: action.payload },
      };
    }
    case USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const userRegisterReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_REGISTER_REQUEST:
      return { loading: true };
    case USER_REGISTER_SUCCESS:
      return { loading: false, success: action.payload };
    case USER_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    case USER_LOGOUT:
      return { userInfo: null };
    default:
      return state;
  }
};

export const userEmailConfirmReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_EMAIL_CONFIRM_REQUEST:
      return { loading: true };
    case USER_EMAIL_CONFIRM_SUCCESS:
      return { loading: false, success: action.payload };
    case USER_EMAIL_CONFIRM_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userEmailResendReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_EMAIL_RESEND_REQUEST:
      return { loading: true };
    case USER_EMAIL_RESEND_SUCCESS:
      return { loading: false, success: action.payload };
    case USER_EMAIL_RESEND_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userPictureUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_PICTURE_UPDATE_REQUEST:
      return { loading: true };
    case USER_PICTURE_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case USER_PICTURE_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const userProjectBgUpdateReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_PROJECT_BG_UPDATE_REQUEST:
      return { loading: true };
    case USER_PROJECT_BG_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case USER_PROJECT_BG_UPDATE_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
