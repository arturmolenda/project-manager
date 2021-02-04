import React from 'react';
import { Link } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { projectTaskArchive } from '../../../../redux/actions/projectActions';
import { PROJECT_SET_TASK_SUCCESS } from '../../../../redux/constants/projectConstants';

import { Draggable } from 'react-smooth-dnd';

import { Divider, makeStyles, Typography } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import SubjectIcon from '@material-ui/icons/Subject';

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
    whiteSpace: 'break-spaces',
    '&:hover': {
      backgroundColor: '#f5f5f5 !important',
      '& svg': {
        display: 'initial',
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
  deleteIcon: {
    display: 'none',
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 3,
    borderRadius: 3,
    color: '#656363',
    zIndex: 40,
    '&:hover': {
      backgroundColor: '#cccccc2b',
    },
  },
}));

const Task = React.memo(({ task, index, listIndex }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const archiveHandle = (e) => {
    e.preventDefault();
    dispatch(projectTaskArchive(task._id, task.projectId, index, listIndex));
  };

  return (
    <Draggable draggableid={task._id} index={index}>
      <Link
        to={`/project/${task.projectId}/${task._id}`}
        style={{ textDecoration: 'none', color: 'initial' }}
        onClick={() =>
          dispatch({ type: PROJECT_SET_TASK_SUCCESS, payload: task })
        }
      >
        <div className={classes.taskContainer}>
          <div className={classes.task}>
            <div className={classes.titleContainer}>
              <Typography variant='subtitle2'>{task.title}</Typography>
            </div>
            {!task.archived && (
              <DeleteIcon
                className={classes.deleteIcon}
                onClick={archiveHandle}
              />
            )}
            {task.description && (
              <>
                <Divider style={{ margin: '3px 0' }} />
                <SubjectIcon />
              </>
            )}
          </div>
        </div>
      </Link>
    </Draggable>
  );
});

export default Task;
