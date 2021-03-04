import React, { useEffect, useState } from 'react';

import { makeStyles, Checkbox } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import ToDoInput from './ToDoInput';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    borderRadius: 3,
    padding: '5px 5px',
    position: 'relative',
    '&:hover': {
      backgroundColor: '#e2e2e2',
      '& svg': {
        display: 'block',
      },
    },
  },
  textContainer: {
    marginLeft: 13,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteIcon: {
    display: 'none',
    padding: 3,
    borderRadius: 3,
    color: '#656363',
    position: 'absolute',
    bottom: 7,
    right: 7,
    '&:hover': {
      backgroundColor: '#ccc',
    },
  },
}));

const TaskItem = ({
  task,
  taskIndex,
  updateTaskCheckHandle,
  deleteTaskHandle,
  updateTaskTitleHandle,
  disabled,
}) => {
  const [checked, setChecked] = useState(false);
  const classes = useStyles();

  useEffect(() => setChecked(task.finished), [task.finished]);

  const updateHandle = (e) => {
    setChecked(e.target.checked);
    updateTaskCheckHandle(e.target.checked, task._id, taskIndex);
  };

  return (
    <div className={classes.container}>
      <Checkbox
        onClick={updateHandle}
        checked={checked}
        disabled={disabled}
        disableRipple
        color='primary'
        style={{ padding: 0, marginTop: 3 }}
      />
      <div className={classes.textContainer}>
        <ToDoInput
          taskId={task._id}
          taskIndex={taskIndex}
          initialTitle={task.title}
          taskFinished={task.finished}
          updateTaskTitleHandle={updateTaskTitleHandle}
          disabled={disabled}
        />
        <DeleteIcon
          className={classes.deleteIcon}
          onClick={() => deleteTaskHandle(task._id, taskIndex, task.finished)}
          style={{ display: disabled && 'none' }}
        />
      </div>
    </div>
  );
};

export default TaskItem;
