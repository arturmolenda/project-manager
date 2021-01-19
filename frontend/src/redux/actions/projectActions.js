import {
  PROJECT_CREATE_FAIL,
  PROJECT_CREATE_REQUEST,
  PROJECT_CREATE_SUCCESS,
  PROJECT_DATA_FAIL,
  PROJECT_DATA_MOVE_TASK,
  PROJECT_DATA_REQUEST,
  PROJECT_DATA_SUCCESS,
  PROJECT_DATA_UPDATE_LISTS,
  PROJECT_TASK_MOVE,
  PROJECT_TASK_MOVE_RESET,
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
      BACKGROUND_COLORS[Math.floor(Math.random() * Math.floor(5))];

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

export const getProjectData = (projectId, prevProjectId) => async (
  dispatch,
  getState
) => {
  try {
    dispatch({ type: PROJECT_DATA_REQUEST });

    const {
      userLogin: { userInfo },
      socketConnection: { socket },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/projects/${projectId}`, config);

    // join and leave socket's project board room
    if (prevProjectId) socket.emit('disconnect-board', { room: prevProjectId });
    socket.emit('join-board', { room: projectId });

    dispatch({ type: PROJECT_DATA_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PROJECT_DATA_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

// Action used to emit to the socket 'task-move' event for other clients
// and also prepare and dispatch data for local task move
export const projectTaskMove = (
  dropResult,
  listIndex,
  projectId,
  task
) => async (dispatch, getState) => {
  const {
    socketConnection: { socket },
    projectTaskMove: { added, removed },
  } = getState();
  const emitTaskMove = (added, removed) => {
    dispatch({
      type: PROJECT_DATA_MOVE_TASK,
      payload: {
        added,
        removed,
        task,
      },
    });
    socket.emit('task-move', {
      added,
      removed,
      taskId: task._id,
      projectId,
    });

    dispatch({ type: PROJECT_TASK_MOVE_RESET });
  };
  if (dropResult.removedIndex !== null && dropResult.addedIndex !== null) {
    emitTaskMove(
      { index: dropResult.addedIndex, listIndex },
      {
        listIndex,
        index: dropResult.removedIndex,
      },
      projectId
    );
  } else if (dropResult.removedIndex !== null) {
    added
      ? emitTaskMove(
          added,
          { listIndex, index: dropResult.removedIndex },
          projectId
        )
      : dispatch({
          type: PROJECT_TASK_MOVE,
          payload: {
            added: false,
            removed: {
              listIndex,
              index: dropResult.removedIndex,
            },
          },
        });
  } else if (dropResult.addedIndex !== null) {
    removed
      ? emitTaskMove(
          { index: dropResult.addedIndex, listIndex },
          removed,
          projectId
        )
      : dispatch({
          type: PROJECT_TASK_MOVE,
          payload: {
            added: { index: dropResult.addedIndex, listIndex },
            removed: false,
          },
        });
  }
};
export const projectListMove = (removedIndex, addedIndex) => async (
  dispatch,
  getState
) => {
  const {
    socketConnection: { socket },
    projectGetData: { lists },
  } = getState();
  const listsCopy = Object.assign({}, lists);
  const [list] = listsCopy.lists.splice(removedIndex, 1);
  listsCopy.lists.splice(addedIndex, 0, list);
  dispatch({ type: PROJECT_DATA_UPDATE_LISTS, payload: listsCopy });
  socket.emit('list-move', {
    addedIndex,
    removedIndex,
    projectId: lists.projectId,
  });
};
