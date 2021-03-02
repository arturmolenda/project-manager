import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  PROJECT_DATA_ADD_LIST,
  PROJECT_DATA_ADD_TASK,
  PROJECT_DATA_JOIN_LINK_UPDATE,
  PROJECT_DATA_LIST_TITLE_UPDATE,
  PROJECT_DATA_TASK_ARCHIVED,
  PROJECT_DATA_TITLE_UPDATE,
  PROJECT_DATA_UPDATE_LABELS,
  PROJECT_DATA_UPDATE_LISTS,
  PROJECT_DATA_USERS_UPDATE,
  PROJECT_UPDATE_MESSAGES,
  PROJECT_SET_TASK_SUCCESS,
  PROJECT_SET_NEW_MESSAGE,
} from '../../redux/constants/projectConstants';

import Lists from './lists/Lists';
import Navbar from './navbar/Navbar';

const Board = () => {
  const { socket } = useSelector((state) => state.socketConnection);
  const { task } = useSelector((state) => state.projectSetTask);
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on('new-task', (data) => {
      dispatch({ type: PROJECT_DATA_ADD_TASK, payload: data });
    });
    socket.on('lists-update', (data) => {
      dispatch({ type: PROJECT_DATA_UPDATE_LISTS, payload: data.newLists });
      if (data.restoredTaskId && task && task._id === data.restoredTaskId) {
        dispatch({
          type: PROJECT_SET_TASK_SUCCESS,
          payload: { ...task, archived: false },
        });
      }
    });
    socket.on('list-added', (data) => {
      dispatch({ type: PROJECT_DATA_ADD_LIST, payload: data });
    });
    socket.on('list-title-updated', (data) => {
      dispatch({ type: PROJECT_DATA_LIST_TITLE_UPDATE, payload: data });
    });
    socket.on('project-title-updated', (data) => {
      dispatch({ type: PROJECT_DATA_TITLE_UPDATE, payload: data });
    });
    socket.on('project-join-link-updated', (data) => {
      dispatch({ type: PROJECT_DATA_JOIN_LINK_UPDATE, payload: data });
    });
    socket.on('project-users-updated', (data) => {
      dispatch({ type: PROJECT_DATA_USERS_UPDATE, payload: data });
    });
    socket.on('task-archived', (data) => {
      dispatch({ type: PROJECT_DATA_TASK_ARCHIVED, payload: data });
      if (task && task._id === data.taskId) {
        dispatch({
          type: PROJECT_SET_TASK_SUCCESS,
          payload: { ...task, archived: true },
        });
      }
    });
    socket.on('task-updated', (data) => {
      if (data.newLists) {
        dispatch({ type: PROJECT_DATA_UPDATE_LISTS, payload: data.newLists });
      }
      if (task && task._id === data.task._id) {
        dispatch({ type: PROJECT_SET_TASK_SUCCESS, payload: data.task });
      }
    });
    socket.on('tasks-updated', ({ tasks }) => {
      if (task) {
        tasks.forEach(
          (t) =>
            t._id === task._id &&
            dispatch({ type: PROJECT_SET_TASK_SUCCESS, payload: t })
        );
      }
    });
    socket.on('labels-updated', (data) => {
      dispatch({ type: PROJECT_DATA_UPDATE_LABELS, payload: data.newLabels });
    });
    socket.on('task-deleted', ({ taskId }) => {
      if (task && task._id === taskId)
        dispatch({
          type: PROJECT_SET_TASK_SUCCESS,
          payload: { ...task, deleted: true },
        });
    });
    socket.on('new-message', (data) => {
      dispatch({ type: PROJECT_SET_NEW_MESSAGE });
      dispatch({ type: PROJECT_UPDATE_MESSAGES, payload: data });
    });
    return () => {
      socket.off('new-task');
      socket.off('lists-update');
      socket.off('list-added');
      socket.off('list-title-updated');
      socket.off('project-title-updated');
      socket.off('project-join-link-updated');
      socket.off('project-users-updated');
      socket.off('task-archived');
      socket.off('task-updated');
      socket.off('tasks-updated');
      socket.off('labels-updated');
      socket.off('task-deleted');
      socket.off('new-message');
    };
  }, [dispatch, socket, task]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100vh',
      }}
    >
      <Navbar />
      <div
        style={{
          height: '100%',
          overflowX: 'auto',
          display: 'grid',
        }}
      >
        <Lists />
      </div>
    </div>
  );
};

export default Board;
