import {
  PROJECT_CREATE_REQUEST,
  PROJECT_CREATE_SUCCESS,
  PROJECT_CREATE_FAIL,
  PROJECT_CREATE_RESET,
  PROJECT_SET_CURRENT,
} from '../constants/projectConstants';

export const projectCreateReducer = (state = {}, action) => {
  switch (action.type) {
    case PROJECT_CREATE_REQUEST:
      return { loading: true };
    case PROJECT_CREATE_SUCCESS:
      return {
        loading: false,
        project: action.payload.project,
      };
    case PROJECT_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case PROJECT_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const projectSetCurrentReducer = (state = {}, action) => {
  switch (action.type) {
    case PROJECT_SET_CURRENT:
      return { project: action.payload };
    default:
      return state;
  }
};
