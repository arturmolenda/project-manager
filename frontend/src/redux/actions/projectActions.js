import {
  PROJECT_CREATE_FAIL,
  PROJECT_CREATE_REQUEST,
  PROJECT_CREATE_SUCCESS,
  PROJECT_DATA_FAIL,
  PROJECT_DATA_MOVE_TASK,
  PROJECT_DATA_REQUEST,
  PROJECT_DATA_SUCCESS,
  PROJECT_DATA_UPDATE_LISTS,
  PROJECT_FIND_USERS_FAIL,
  PROJECT_FIND_USERS_REQUEST,
  PROJECT_FIND_USERS_SUCCESS,
  PROJECT_SET_CURRENT,
  PROJECT_SET_TASK_FAIL,
  PROJECT_SET_TASK_REQUEST,
  PROJECT_SET_TASK_SUCCESS,
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

    // join and leave socket's project board room
    if (prevProjectId) socket.emit('disconnect-board', { room: prevProjectId });
    socket.emit('join-board', { room: projectId });

    const { data } = await axios.get(`/api/projects/${projectId}`, config);

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
export const projectTaskMove = (dropResult, listIndex, projectId, task) => (
  dispatch,
  getState
) => {
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
export const projectListMove = (removedIndex, addedIndex) => (
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

export const projectTaskArchive = (taskId, projectId, taskIndex, listIndex) => (
  dispatch,
  getState
) => {
  const {
    socketConnection: { socket },
    projectGetData: { lists },
  } = getState();

  const listsCopy = deepcopy(lists);
  const [task] = listsCopy.lists[listIndex].tasks.splice(taskIndex, 1);
  task.archived = true;
  listsCopy.archivedTasks.unshift(task);
  dispatch({ type: PROJECT_DATA_UPDATE_LISTS, payload: listsCopy });

  socket.emit('task-archive', {
    taskId,
    projectId,
    listIndex,
  });
};

export const projectTasksArchive = (listIndex, callback) => (
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
    listsCopy.archivedTasks = [...archivedTasks, ...listsCopy.archivedTasks];
  }
  dispatch({ type: PROJECT_DATA_UPDATE_LISTS, payload: listsCopy });
  callback();

  socket.emit('tasks-archive', {
    projectId: lists.projectId,
    listIndex,
  });
};

export const projectListDelete = (listIndex, listId, callback) => (
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
    listsCopy.archivedTasks = [...archivedTasks, ...listsCopy.archivedTasks];
  }
  dispatch({ type: PROJECT_DATA_UPDATE_LISTS, payload: listsCopy });
  callback();

  socket.emit('list-delete', {
    projectId: lists.projectId,
    listIndex,
    listId,
  });
};

export const projectTaskDelete = (taskId, taskIndex, callback) => (
  dispatch,
  getState
) => {
  const {
    socketConnection: { socket },
    projectGetData: { lists },
  } = getState();

  const listsCopy = deepcopy(lists);
  listsCopy.archivedTasks.splice(taskIndex, 1);
  dispatch({ type: PROJECT_DATA_UPDATE_LISTS, payload: listsCopy });
  callback();

  socket.emit('task-delete', {
    projectId: lists.projectId,
    taskId,
    taskIndex,
  });
};

export const projectTaskTransfer = (
  taskIndex,
  listIndex,
  newListIndex,
  callback
) => (dispatch, getState) => {
  const {
    socketConnection: { socket },
    projectGetData: { lists },
  } = getState();

  const listsCopy = deepcopy(lists);
  let task;
  // if listIndex is undefined then function is called from archived tasks
  if (listIndex) {
    [task] = listsCopy.lists[listIndex].tasks.splice(taskIndex, 1);
  } else {
    [task] = listsCopy.archivedTasks.splice(taskIndex, 1);
    task.archived = false;
  }
  listsCopy.lists[newListIndex].tasks.push(task);
  dispatch({ type: PROJECT_DATA_UPDATE_LISTS, payload: listsCopy });
  callback();
  socket.emit('task-transfer', {
    projectId: lists.projectId,
    taskId: task._id,
    listIndex,
    newListIndex,
  });
};

export const projectTasksTransfer = (listIndex, newListIndex, callback) => (
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
  listsCopy.lists[newListIndex].tasks = [
    ...listsCopy.lists[newListIndex].tasks,
    ...tasks,
  ];
  dispatch({ type: PROJECT_DATA_UPDATE_LISTS, payload: listsCopy });
  callback();
  socket.emit('tasks-transfer', {
    projectId: lists.projectId,
    listIndex,
    newListIndex,
  });
};

export const findUsersToInvite = (userData) => async (dispatch, getState) => {
  try {
    dispatch({ type: PROJECT_FIND_USERS_REQUEST });

    const {
      userLogin: { userInfo },
      projectGetData: { project },
    } = getState();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // eslint-disable-next-line
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isEmail = regex.test(userData.toLowerCase());

    const { data } = await axios.post(
      `/api/users/find/${project._id}`,
      { userData, isEmail },
      config
    );
    dispatch({ type: PROJECT_FIND_USERS_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PROJECT_FIND_USERS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const sendProjectInvitations = (users, callback) => (
  dispatch,
  getState
) => {
  const {
    socketConnection: { socket },
    projectGetData: { project },
  } = getState();

  socket.emit(
    'project-invite-users',
    {
      projectId: project._id,
      users,
    },
    callback
  );
};

export const updateUserPermissions = (
  userId,
  permissions,
  projectId,
  handleClose
) => (dispatch, getState) => {
  const {
    socketConnection: { socket },
  } = getState();

  socket.emit(
    'project-user-permissions-update',
    {
      projectId,
      userId,
      newPermissions: permissions === 2 ? 1 : permissions === 1 && 2,
    },
    handleClose
  );
};

export const removeUserFromProject = (userId, projectId, handleClose) => (
  dispatch,
  getState
) => {
  const {
    socketConnection: { socket },
    projectGetData: { project },
  } = getState();

  if (project.creatorId !== userId) {
    socket.emit(
      'project-user-remove',
      {
        projectId,
        userId,
      },
      handleClose
    );
  }
};

export const setTask = (projectId, taskId) => async (dispatch, getState) => {
  try {
    dispatch({ type: PROJECT_SET_TASK_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        // 'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(
      `/api/projects/getTask/${projectId}/${taskId}`,
      config
    );

    dispatch({ type: PROJECT_SET_TASK_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: PROJECT_SET_TASK_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const taskFieldUpdate = (
  taskId,
  projectId,
  updatedData,
  fieldName,
  callback
) => (dispatch, getState) => {
  const {
    socketConnection: { socket },
  } = getState();
  socket.emit(
    'task-field-update',
    { taskId, projectId, updatedData, fieldName },
    callback
  );
};
