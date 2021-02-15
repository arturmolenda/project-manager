import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import {
  addToDoTask,
  updateToDoListTitle,
  updateToDoTaskProgress,
} from '../../../../../redux/actions/projectActions';

import { makeStyles } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import TasksProgress from './TasksProgress';
import ToDoItem from './ToDoItem';
import ToDoTitleUpdate from './ToDoTitleUpdate';
import ToDoMenu from './ToDoMenu';
import ToDoInput from './ToDoInput';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 15,
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  title: {
    display: 'flex',
    width: '100%',
    '& svg': {
      margin: '3px 12px 0 0',
    },
  },
  showButtonsIcon: {
    cursor: 'pointer',
    marginBottom: 5,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}));

const ToDoList = ({ index, projectId, taskId, list, userId }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const hideTasks = list.usersWithHiddenTasks.includes(userId);

  const updateTitleHandle = (title, callback) => {
    dispatch(
      updateToDoListTitle(taskId, projectId, list._id, index, title, callback)
    );
  };
  const updateTaskCheckHandle = (check, toDoTaskId, toDoTaskIndex) => {
    dispatch(
      updateToDoTaskProgress(
        taskId,
        list._id,
        index,
        toDoTaskId,
        toDoTaskIndex,
        projectId,
        check
      )
    );
  };
  const hideHandle = () => {
    console.log('hide handle');
  };
  const showHandle = () => {
    console.log('show handle');
  };
  const deleteListHandle = () => {
    console.log('delete list handle');
  };
  const deleteTaskHandle = (taskId) => {
    console.log('delete task handle');
  };
  const addTaskHandle = (title, callback) => {
    dispatch(addToDoTask(taskId, list._id, index, projectId, title, callback));
  };
  const updateTaskTitleHandle = (taskId, title) => {
    console.log('update task title handle');
  };

  return (
    <>
      <div className={classes.container}>
        <div className={classes.titleContainer}>
          <div className={classes.title}>
            <CheckCircleOutlineIcon color='primary' />
            <ToDoTitleUpdate
              currentTitle={list.title}
              updateHandle={updateTitleHandle}
            />
          </div>
          <MoreVertIcon
            className={classes.showButtonsIcon}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          />
        </div>
        <TasksProgress
          totalTasks={list.tasks.length}
          finishedTasks={list.tasksFinished}
        />
        {list.tasks.map((task, taskIndex) =>
          task.finished && hideTasks ? null : (
            <ToDoItem
              key={task._id}
              taskIndex={taskIndex}
              task={task}
              updateTaskCheckHandle={updateTaskCheckHandle}
              deleteTaskHandle={deleteTaskHandle}
              updateTaskTitleHandle={updateTaskTitleHandle}
            />
          )
        )}
        <ToDoInput addTaskHandle={addTaskHandle} />
      </div>

      <ToDoMenu
        hideHandle={hideHandle}
        showHandle={showHandle}
        tasksFinished={list.tasksFinished}
        hideTasks={hideTasks}
        anchorEl={anchorEl}
        closeHandle={() => setAnchorEl(null)}
        deleteListHandle={deleteListHandle}
      />
    </>
  );
};

export default ToDoList;
