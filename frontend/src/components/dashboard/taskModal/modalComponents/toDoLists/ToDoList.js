import React, { useEffect, useState } from 'react';

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

const ToDoList = ({ list, userId }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [tasksFinished, setTasksFinished] = useState(0);
  const classes = useStyles();
  const hideTasks = list.usersWithHiddenTasks.includes(userId);

  useEffect(() => {
    setTasksFinished(list.tasks.reduce((a, task) => a + task.finished, 0));
  }, [list.tasks]);

  const updateTitleHandle = (title, callback) => {
    console.log('title updated');
  };
  const taskCheckHandle = (check, taskId) => {
    console.log('check/uncheck task');
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
  const addTaskHandle = (title) => {
    console.log('add task handle');
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
          finishedTasks={tasksFinished}
        />
        {list.tasks.map((task) =>
          task.finished ? (
            hideTasks && null
          ) : (
            <ToDoItem
              key={task._id}
              task={task}
              taskCheckHandle={taskCheckHandle}
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
        tasksFinished={tasksFinished}
        hideTasks={hideTasks}
        anchorEl={anchorEl}
        closeHandle={() => setAnchorEl(null)}
        deleteListHandle={deleteListHandle}
      />
    </>
  );
};

export default ToDoList;
