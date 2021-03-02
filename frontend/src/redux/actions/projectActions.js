import {
  PROJECT_CREATE_FAIL,
  PROJECT_CREATE_REQUEST,
  PROJECT_CREATE_SUCCESS,
  PROJECT_DATA_FAIL,
  PROJECT_DATA_MOVE_TASK,
  PROJECT_DATA_REQUEST,
  PROJECT_DATA_SUCCESS,
  PROJECT_DATA_UPDATE_LABELS,
  PROJECT_DATA_UPDATE_LISTS,
  PROJECT_FIND_USERS_FAIL,
  PROJECT_FIND_USERS_REQUEST,
  PROJECT_FIND_USERS_SUCCESS,
  PROJECT_RESET_NEW_MESSAGE,
  PROJECT_SET_CURRENT,
  PROJECT_SET_MESSAGES,
  PROJECT_SET_TASK_FAIL,
  PROJECT_SET_TASK_REQUEST,
  PROJECT_SET_TASK_SUCCESS,
  PROJECT_TASK_MOVE,
  PROJECT_TASK_MOVE_RESET,
  PROJECT_TODO_VISIBILITY_UPDATE,
} from '../constants/projectConstants';
import { USER_DATA_UPDATE } from '../constants/userConstants';
import { BACKGROUND_COLORS } from '../../util/colorsContants';
import axios from 'axios';
import deepcopy from 'deepcopy';
import { getTaskIndexes } from '../../util/utilFunctions';

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
    userInfoClone.projectsThemes[data.project._id] = { background };
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

    const {
      data: { project, labels, lists, messages },
    } = await axios.get(`/api/projects/${projectId}`, config);

    dispatch({
      type: PROJECT_DATA_SUCCESS,
      payload: { project, labels, lists },
    });
    dispatch({ type: PROJECT_SET_MESSAGES, payload: messages });
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
    projectSetTask: { task: taskOpened },
  } = getState();

  getTaskIndexes(
    lists.lists,
    taskIndex,
    listIndex,
    taskId,
    (currentListIndex, currentTaskIndex) => {
      const listsCopy = deepcopy(lists);
      const [task] = listsCopy.lists[currentListIndex].tasks.splice(
        currentTaskIndex,
        1
      );
      task.archived = true;
      listsCopy.archivedTasks.unshift(task);
      dispatch({ type: PROJECT_DATA_UPDATE_LISTS, payload: listsCopy });
      if (taskOpened && taskOpened._id === taskId)
        dispatch({
          type: PROJECT_SET_TASK_SUCCESS,
          payload: { ...taskOpened, archived: true },
        });
      socket.emit('task-archive', {
        taskId,
        projectId,
        listIndex: currentListIndex,
      });
    }
  );
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
  taskId,
  taskIndex,
  listIndex,
  newListIndex,
  currentListId,
  newListId,
  callback
) => (dispatch, getState) => {
  const {
    socketConnection: { socket },
    projectGetData: { lists },
    projectSetTask: { task: taskOpened },
  } = getState();

  const listsCopy = deepcopy(lists);
  let task;
  // if listIndex is undefined then function is called from archived tasks
  if (listIndex !== null) {
    [task] = listsCopy.lists[listIndex].tasks.splice(taskIndex, 1);
  } else {
    if (taskOpened && taskOpened._id === taskId)
      dispatch({
        type: PROJECT_SET_TASK_SUCCESS,
        payload: { ...taskOpened, archived: false },
      });
    [task] = listsCopy.archivedTasks.splice(taskIndex, 1);
    task.archived = false;
  }
  listsCopy.lists[newListIndex].tasks.push(task);
  dispatch({ type: PROJECT_DATA_UPDATE_LISTS, payload: listsCopy });
  callback();

  socket.emit('task-transfer', {
    projectId: lists.projectId,
    taskId,
    currentListId,
    newListId,
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

export const taskUsersUpdate = (
  taskId,
  projectId,
  newUsers,
  removedUsers,
  addedUsers,
  callback
) => (dispatch, getState) => {
  const {
    socketConnection: { socket },
  } = getState();
  socket.emit(
    'task-users-update',
    { taskId, projectId, newUsers, removedUsers, addedUsers },
    callback
  );
};

export const updateLabels = (
  taskId,
  projectId,
  newLabels,
  listIndex,
  taskIndex
) => (dispatch, getState) => {
  const {
    socketConnection: { socket },
    projectGetData: { lists },
    projectSetTask: { task },
  } = getState();
  const listsCopy = deepcopy(lists);
  getTaskIndexes(
    listsCopy.lists,
    listIndex,
    taskIndex,
    taskId,
    (newListIndex, newTaskIndex) => {
      listsCopy.lists[newListIndex].tasks[newTaskIndex].labels = newLabels;
      dispatch({ type: PROJECT_DATA_UPDATE_LISTS, payload: listsCopy });
      dispatch({
        type: PROJECT_SET_TASK_SUCCESS,
        payload: { ...task, labels: newLabels },
      });
    }
  );

  socket.emit('task-field-update', {
    taskId,
    projectId,
    updatedData: newLabels,
    fieldName: 'labels',
  });
};

export const createLabel = (listIndex, taskIndex, taskId, label, callback) => (
  dispatch,
  getState
) => {
  const {
    projectGetData: { lists, labels },
    projectSetTask: { task },
  } = getState();
  const listsCopy = deepcopy(lists);
  getTaskIndexes(
    listsCopy.lists,
    listIndex,
    taskIndex,
    taskId,
    (newListIndex, newTaskIndex) => {
      listsCopy.lists[newListIndex].tasks[newTaskIndex].labels.push(label._id);
      labels.labels[label._id] = label;
      labels.labelIds.push(label._id);
      dispatch({ type: PROJECT_DATA_UPDATE_LABELS, payload: labels });
      if (task._id === taskId) {
        dispatch({
          type: PROJECT_SET_TASK_SUCCESS,
          payload: { ...task, labels: [...task.labels, label._id] },
        });
        callback();
      }
      dispatch({ type: PROJECT_DATA_UPDATE_LISTS, payload: listsCopy });
    }
  );
};

export const deleteLabel = (labelId, callback) => (dispatch, getState) => {
  const {
    projectGetData: { labels },
    socketConnection: { socket },
  } = getState();
  delete labels.labels[labelId];
  labels.labelIds = labels.labelIds.filter((id) => id !== labelId);
  dispatch({ type: PROJECT_DATA_UPDATE_LABELS, payload: labels });
  callback();
  socket.emit('label-delete', { projectId: labels.projectId, labelId });
};

export const editLabel = (labelId, title, color, callback) => (
  dispatch,
  getState
) => {
  const {
    projectGetData: { labels },
    socketConnection: { socket },
  } = getState();
  labels.labels[labelId] = {
    ...labels.labels[labelId],
    title,
    color,
  };
  dispatch({ type: PROJECT_DATA_UPDATE_LABELS, payload: labels });
  callback();

  socket.emit('label-edit', {
    projectId: labels.projectId,
    title,
    color,
    labelId,
  });
};

export const createToDoList = (taskId, projectId, title, callback) => (
  dispatch,
  getState
) => {
  const {
    socketConnection: { socket },
  } = getState();

  socket.emit(
    'add-to-do-list',
    {
      projectId,
      title,
      taskId,
    },
    callback
  );
};

export const updateToDoListTitle = (
  taskId,
  projectId,
  listId,
  listIndex,
  title,
  callback
) => (dispatch, getState) => {
  const {
    socketConnection: { socket },
    projectSetTask: { task },
  } = getState();

  if (task && task._id === taskId) {
    task.toDoLists.lists[listIndex].title = title;
    dispatch({ type: PROJECT_SET_TASK_SUCCESS, payload: task });
    callback();
  }

  socket.emit('update-to-do-list-title', {
    projectId,
    title,
    listId,
    taskId,
  });
};

export const updateToDoListVisibility = (listId, visibility) => (
  dispatch,
  getState
) => {
  const {
    projectToDoVisibility: { listIds },
  } = getState();

  if (visibility) listIds.push(listId);
  else {
    const idIndex = listIds.indexOf(listId);
    listIds.splice(idIndex, 1);
  }
  dispatch({ type: PROJECT_TODO_VISIBILITY_UPDATE, payload: listIds });
  localStorage.setItem('toDoListIds', JSON.stringify(listIds));
};

export const deleteToDoList = (
  taskId,
  projectId,
  listId,
  listIndex,
  callback
) => (dispatch, getState) => {
  const {
    socketConnection: { socket },
    projectSetTask: { task },
  } = getState();

  if (task && task._id === taskId) {
    const [toDoList] = task.toDoLists.lists.splice(listIndex, 1);
    task.toDoLists.totalTasks -= toDoList.tasks.length;
    task.toDoLists.tasksCompleted -= toDoList.tasksCompleted;
    dispatch({ type: PROJECT_SET_TASK_SUCCESS, payload: task });
    callback();
  }
  socket.emit('delete-to-do-list', {
    taskId,
    projectId,
    listId,
  });
};

export const addToDoTask = (
  taskId,
  toDoListId,
  toDoListIndex,
  projectId,
  title,
  callback
) => (dispatch, getState) => {
  const {
    socketConnection: { socket },
    projectSetTask: { task },
  } = getState();

  socket.emit(
    'add-to-do-task',
    {
      taskId,
      projectId,
      title,
      toDoListId,
    },
    (toDoTask) => {
      if (task && task._id === taskId) {
        task.toDoLists.lists[toDoListIndex].tasks.push(toDoTask);
        task.toDoLists.totalTasks += 1;
        dispatch({ type: PROJECT_SET_TASK_SUCCESS, payload: task });
        callback();
      }
    }
  );
};

export const updateToDoTaskProgress = (
  taskId,
  toDoListId,
  toDoListIndex,
  toDoTaskId,
  toDoTaskIndex,
  projectId,
  completed
) => (dispatch, getState) => {
  const {
    socketConnection: { socket },
    projectSetTask: { task },
  } = getState();

  if (task && task._id === taskId) {
    task.toDoLists.lists[toDoListIndex].tasks[
      toDoTaskIndex
    ].finished = completed;
    if (completed) {
      task.toDoLists.tasksFinished++;
      task.toDoLists.lists[toDoListIndex].tasksFinished++;
    } else {
      task.toDoLists.tasksFinished--;
      task.toDoLists.lists[toDoListIndex].tasksFinished--;
    }
    dispatch({ type: PROJECT_SET_TASK_SUCCESS, payload: task });
  }

  socket.emit('update-to-do-task-progress', {
    taskId,
    toDoTaskId,
    toDoListId,
    projectId,
    completed,
  });
};

export const updateToDoTaskTitle = (
  taskId,
  toDoListId,
  toDoListIndex,
  toDoTaskId,
  toDoTaskIndex,
  projectId,
  title,
  callback
) => (dispatch, getState) => {
  const {
    socketConnection: { socket },
    projectSetTask: { task },
  } = getState();

  if (task && task._id === taskId) {
    task.toDoLists.lists[toDoListIndex].tasks[toDoTaskIndex].title = title;
    dispatch({ type: PROJECT_SET_TASK_SUCCESS, payload: task });
    callback();
  }

  socket.emit('update-to-do-task-title', {
    taskId,
    toDoTaskId,
    toDoListId,
    projectId,
    title,
  });
};

export const deleteToDoTask = (
  taskId,
  toDoListId,
  toDoListIndex,
  toDoTaskId,
  toDoTaskIndex,
  projectId,
  completed
) => (dispatch, getState) => {
  const {
    socketConnection: { socket },
    projectSetTask: { task },
  } = getState();

  if (task && task._id === taskId) {
    task.toDoLists.lists[toDoListIndex].tasks.splice(toDoTaskIndex, 1);
    task.toDoLists.lists.totalTasks -= 1;
    if (completed) {
      task.toDoLists.lists.tasksCompleted -= 1;
      task.toDoLists.lists[toDoListIndex].tasksFinished -= 1;
    }
    dispatch({ type: PROJECT_SET_TASK_SUCCESS, payload: task });
  }

  socket.emit('delete-to-do-task', {
    taskId,
    toDoTaskId,
    toDoListId,
    projectId,
    completed,
  });
};

export const addComment = (taskId, projectId, comment, callback) => (
  dispatch,
  getState
) => {
  const {
    userLogin: { userInfo },
    socketConnection: { socket },
    projectSetTask: { task },
  } = getState();

  socket.emit(
    'add-comment',
    {
      taskId,
      projectId,
      comment,
    },
    (createdComment) => {
      if (task && task._id === taskId) {
        createdComment.user = {
          _id: userInfo._id,
          username: userInfo.username,
          profilePicture: userInfo.profilePicture,
        };
        task.comments.unshift(createdComment);
        dispatch({ type: PROJECT_SET_TASK_SUCCESS, payload: task });
        callback();
      }
    }
  );
};

export const editComment = (
  taskId,
  projectId,
  commentId,
  newComment,
  commentIndex,
  callback
) => (dispatch, getState) => {
  const {
    socketConnection: { socket },
    projectSetTask: { task },
  } = getState();

  if (task && task._id === taskId) {
    task.comments[commentIndex].comment = newComment;
    task.comments[commentIndex].updatedAt = new Date();
    dispatch({ type: PROJECT_SET_TASK_SUCCESS, payload: task });
    callback();
  }

  socket.emit('edit-comment', {
    taskId,
    projectId,
    commentId,
    newComment,
  });
};

export const deleteComment = (
  taskId,
  projectId,
  commentId,
  commentIndex,
  callback
) => (dispatch, getState) => {
  const {
    socketConnection: { socket },
    projectSetTask: { task },
  } = getState();

  if (task && task._id === taskId) {
    task.comments.splice(commentIndex, 1);
    dispatch({ type: PROJECT_SET_TASK_SUCCESS, payload: task });
    callback();
  }

  socket.emit('delete-comment', {
    taskId,
    projectId,
    commentId,
  });
};

export const copyTask = (projectId, taskId, newListId, callback) => (
  dispatch,
  getState
) => {
  const {
    socketConnection: { socket },
  } = getState();
  socket.emit(
    'copy-task',
    {
      taskId,
      projectId,
      newListId,
    },
    callback
  );
};

export const updateTaskWatch = (
  taskId,
  userId,
  isWatching,
  taskIndex,
  listIndex
) => (dispatch, getState) => {
  const {
    socketConnection: { socket },
    projectSetTask: { task },
    projectGetData: { lists },
  } = getState();

  const updateUsersWatching = (listIndex, taskIndex, lists, task) => {
    if (isWatching) {
      const userIndex = task.usersWatching.indexOf(userId);
      if (userIndex > -1) {
        task.usersWatching.splice(userIndex, 1);
        if (listIndex) {
          lists.lists[listIndex].tasks[taskIndex].usersWatching.splice(
            userIndex,
            1
          );
        } else {
          lists.archivedTasks[taskIndex].usersWatching.splice(userIndex, 1);
        }
      }
    } else {
      task.usersWatching.push(userId);
      if (listIndex) {
        lists.lists[listIndex].tasks[taskIndex].usersWatching.push(userId);
      } else {
        lists.archivedTasks[taskIndex].usersWatching.push(userId);
      }
    }

    dispatch({ type: PROJECT_DATA_UPDATE_LISTS, payload: lists });
    dispatch({ type: PROJECT_SET_TASK_SUCCESS, payload: task });
  };

  if (listIndex) {
    getTaskIndexes(
      lists.lists,
      taskIndex,
      listIndex,
      taskId,
      (currentListIndex, currentTaskIndex) => {
        const taskClone = deepcopy(task);
        updateUsersWatching(
          currentListIndex,
          currentTaskIndex,
          lists,
          taskClone
        );
      }
    );
  } else {
    const taskClone = deepcopy(task);
    updateUsersWatching(null, taskIndex, lists, taskClone);
  }

  socket.emit('task-watch', {
    taskId,
    isWatching,
  });
};

export const sendMessage = (message, callback) => (dispatch, getState) => {
  const {
    socketConnection: { socket },
    projectGetData: {
      project: { _id: projectId },
    },
    userLogin: {
      userInfo: { username, profilePicture },
    },
  } = getState();
  dispatch({ type: PROJECT_RESET_NEW_MESSAGE });
  socket.emit(
    'send-message',
    {
      projectId,
      message,
      username,
      profilePicture,
    },
    callback
  );
};

export const deleteProject = (projectId, callback) => (dispatch, getState) => {
  const {
    socketConnection: { socket },
  } = getState();

  socket.emit(
    'delete-project',
    {
      projectId,
    },
    callback
  );
};
