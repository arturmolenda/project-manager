import React from 'react';
import { Link } from 'react-router-dom';

import { makeStyles, Typography } from '@material-ui/core';

import { Draggable } from 'react-smooth-dnd';

const useStyles = makeStyles(() => ({
  taskContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'relative',
    cursor: 'pointer',
    borderBottom: '1px solid #9e9e9e',
    border: '1px solid #ddd',
    borderRadius: 3,
    backgroundColor: '#ececec',
    marginBottom: 8,
    wordBreak: 'break-word',
    '&:hover': {
      backgroundColor: '#f5f5f5 !important',
      '& svg': {
        display: 'block',
      },
    },
  },
  task: {
    padding: '5px 10px 10px 10px',
    transition: 'background-color 0.2s ease',
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'flex-start',
  },
}));

const Task = React.memo(({ task, projectId, index }) => {
  const classes = useStyles();

  return (
    <Draggable draggableid={task._id} index={index}>
      <Link
        to={`/project/${projectId}/${task._id}`}
        style={{ textDecoration: 'none', color: 'initial' }}
      >
        <div className={classes.taskContainer}>
          <div className={classes.task}>
            <div className={classes.titleContainer}>
              <Typography variant='subtitle2'>{task.title}</Typography>
            </div>
          </div>
        </div>
      </Link>
    </Draggable>
  );
});

export default Task;
