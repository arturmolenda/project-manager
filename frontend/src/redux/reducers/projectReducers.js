import {
  PROJECT_CREATE_REQUEST,
  PROJECT_CREATE_SUCCESS,
  PROJECT_CREATE_FAIL,
  PROJECT_CREATE_RESET,
  PROJECT_SET_CURRENT,
  PROJECT_SET_CURRENT_RESET,
  PROJECT_GET_DATA_REQUEST,
  PROJECT_GET_DATA_SUCCESS,
  PROJECT_GET_DATA_FAIL,
  PROJECT_GET_DATA_RESET,
  PROJECT_GET_DATA_ADD_TASK,
} from '../constants/projectConstants';
import deepcopy from 'deepcopy';

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
    case PROJECT_SET_CURRENT_RESET:
      return {};
    default:
      return state;
  }
};

export const projectGetDataReducer = (state = { loading: true }, action) => {
  switch (action.type) {
    case PROJECT_GET_DATA_REQUEST:
      return { loading: true };
    case PROJECT_GET_DATA_SUCCESS:
      return {
        loading: false,
        project: action.payload.project,
        lists: action.payload.lists,
        labels: action.payload.labels,
      };
    case PROJECT_GET_DATA_ADD_TASK:
      const stateClone = deepcopy(state);
      const listIndex = stateClone.lists.lists.findIndex(
        (list) => list._id === action.payload.listId
      );
      stateClone.lists.lists[listIndex].tasks.push(action.payload.task);
      return stateClone;
    case PROJECT_GET_DATA_FAIL:
      return { loading: false, error: action.payload };
    case PROJECT_GET_DATA_RESET:
      return {};
    default:
      return state;
  }
};
