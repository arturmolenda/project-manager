import {
  PROJECT_CREATE_FAIL,
  PROJECT_CREATE_REQUEST,
  PROJECT_CREATE_SUCCESS,
  PROJECT_DATA_FAIL,
  PROJECT_DATA_MOVE_TASK,
  PROJECT_DATA_REQUEST,
  PROJECT_DATA_SUCCESS,
  PROJECT_DATA_UPDATE_LISTS,
  PROJECT_SET_CURRENT,
  PROJECT_TASK_MOVE,
  PROJECT_TASK_MOVE_RESET,
} from '../constants/projectConstants';
import { USER_DATA_UPDATE } from '../constants/userConstants';
import { BACKGROUND_COLORS } from '../../util/colorsContants';
import axios from 'axios';
import deepcopy from 'deepcopy';

export const createProject = (title, callback) => async (
  dispatch,
  getState
) => {
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
    callback(data.project._id);

    const userInfoClone = Object.assign({}, userInfo);
    userInfoClone.projectsCreated.push(data.project);
    // Update user's projects and set current project
    dispatch({ type: USER_DATA_UPDATE, payload: userInfoClone });
    dispatch({ type: PROJECT_SET_CURRENT, payload: data.project });
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

export const projectTaskArchive = (
  taskId,
  projectId,
  taskIndex,
  listIndex
) => async (dispatch, getState) => {
  const {
    socketConnection: { socket },
    projectGetData: { lists },
  } = getState();

  const listsCopy = deepcopy(lists);
  const [task] = listsCopy.lists[listIndex].tasks.splice(taskIndex, 1);
  task.archived = true;
  listsCopy.archivedTasks.push(task);
  dispatch({ type: PROJECT_DATA_UPDATE_LISTS, payload: listsCopy });

  socket.emit('task-archive', {
    taskId,
    projectId,
    listIndex,
  });
};

export const projectTasksArchive = (listIndex, callback) => async (
  dispatch,
  getState
) => {
  const {
    socketConnection: { socket },
    projectGetData: { lists },
  } = getState();

  const listsCopy = deepcopy(lists);
  const tasks = listsCopy.lists[listIndex].tasks.splice(
    0,
    listsCopy.lists[listIndex].tasks.length
  );
  if (tasks.length > 0) {
    const archivedTasks = tasks.map((task) => {
      task.archived = true;
      return task;
    });
    listsCopy.archivedTasks = [...listsCopy.archivedTasks, ...archivedTasks];
  }
  dispatch({ type: PROJECT_DATA_UPDATE_LISTS, payload: listsCopy });
  callback();

  socket.emit('tasks-archive', {
    projectId: lists.projectId,
    listIndex,
  });
};

export const projectListDelete = (listIndex, listId, callback) => async (
  dispatch,
  getState
) => {
  const {
    socketConnection: { socket },
    projectGetData: { lists },
  } = getState();

  const listsCopy = deepcopy(lists);
  const [list] = listsCopy.lists.splice(listIndex, 1);
  if (list.tasks.length > 0) {
    const archivedTasks = list.tasks.map((task) => {
      task.archived = true;
      return task;
    });
    listsCopy.archivedTasks = [...listsCopy.archivedTasks, ...archivedTasks];
  }
  dispatch({ type: PROJECT_DATA_UPDATE_LISTS, payload: listsCopy });
  callback();

  socket.emit('list-delete', {
    projectId: lists.projectId,
    listIndex,
    listId,
  });
};
