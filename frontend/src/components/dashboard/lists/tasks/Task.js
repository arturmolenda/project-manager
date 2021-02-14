import React from 'react';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { projectTaskArchive } from '../../../../redux/actions/projectActions';
import { PROJECT_SET_TASK_SUCCESS } from '../../../../redux/constants/projectConstants';

import { Draggable } from 'react-smooth-dnd';

import { makeStyles, Typography } from '@material-ui/core';

import DeleteIcon from '@material-ui/icons/Delete';
import SubjectIcon from '@material-ui/icons/Subject';

import TaskDeadlineIcon from './taskComponents/TaskDeadlineIcon';
import TaskUsers from './taskComponents/TaskUsers';
import LabelItem from '../../shared/LabelItem';
import TaskTasksCompleted from './taskComponents/TaskTasksCompleted';

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
    wordBreak: 'break-word',
    whiteSpace: 'break-spaces',
  },
  taskDetails: {
    minHeight: 30,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  labels: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '5px 5px 0',
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
  taskIconIndicators: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    '& > *': {
      marginRight: 5,
    },
  },
}));

const Task = React.memo(({ task, index, listIndex }) => {
  const {
    labels: { labels },
  } = useSelector((state) => state.projectGetData);
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
          <div className={classes.labels}>
            {task.labels.length > 0 &&
              task.labels.map((labelId) => (
                <LabelItem key={labelId} label={labels[labelId]} small />
              ))}
          </div>
          <div className={classes.task}>
            <div className={classes.titleContainer}>
              <Typography variant='subtitle2'>{task.title}</Typography>
            </div>
            <div className={classes.taskIconIndicators}>
              {task.description && <SubjectIcon />}
              {task.deadline && <TaskDeadlineIcon deadline={task.deadline} />}
              {task.toDoLists.totalTasks > 0 && (
                <TaskTasksCompleted
                  total={task.toDoLists.totalTasks}
                  completed={task.toDoLists.tasksCompleted}
                />
              )}
              {task.users && <TaskUsers users={task.users} />}
            </div>
            {!task.archived && (
              <DeleteIcon
                className={classes.deleteIcon}
                onClick={archiveHandle}
              />
            )}
          </div>
        </div>
      </Link>
    </Draggable>
  );
});

export default Task;
