import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { getTaskIndexes } from '../../../../util/utilFunctions';

import { makeStyles, Typography } from '@material-ui/core';

import Archive from './sideComponents/Archive';
import Copy from './sideComponents/Copy';
import Deadline from './sideComponents/Deadline';
import Label from './sideComponents/labels/Label';
import ToDoList from './sideComponents/toDoList/ToDoList';
import Transfer from './sideComponents/Transfer';
import Users from './sideComponents/users/Users';
import Watch from './sideComponents/Watch';
import equal from 'fast-deep-equal';

const useStyles = makeStyles((theme) => ({
  container: {
    width: 168,
    height: 500,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: 10,
    [theme.breakpoints.down('sm')]: {
      width: '100%',
      height: 'auto',
      padding: 0,
    },
  },
  buttonsContainer: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      flexWrap: 'wrap',
      marginBottom: '0 !important',
    },
  },
  caption: {
    fontWeight: 600,
    color: '#979a9a',
  },
}));

const SideContent = React.memo(
  ({ task, task: { archived, _id: taskId } }) => {
    const { lists } = useSelector((state) => state.projectGetData);
    const [currentListId, setCurrentListId] = useState(false);
    const [listIndex, setListIndex] = useState(false);
    const [taskIndex, setTaskIndex] = useState(false);
    const classes = useStyles();

    useEffect(() => {
      if (!archived) {
        getTaskIndexes(
          lists.lists,
          taskIndex,
          listIndex,
          taskId,
          (foundListIndex, foundTaskIndex) => {
            setListIndex(foundListIndex);
            setTaskIndex(foundTaskIndex);
            setCurrentListId(lists.lists[foundListIndex]._id);
          }
        );
      } else {
        const archivedIndex = lists.archivedTasks.findIndex(
          (task) => task._id === taskId
        );
        if (archivedIndex > -1) setTaskIndex(archivedIndex);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lists, archived, taskId]);

    return (
      <div className={classes.container}>
        <Typography variant='caption' className={classes.caption}>
          ADD TO TASK
        </Typography>
        <div className={classes.buttonsContainer} style={{ marginBottom: 20 }}>
          <Users task={task} disabled={task.archived} />
          <Label
            task={task}
            disabled={task.archived}
            taskIndex={taskIndex}
            listIndex={listIndex}
          />
          <ToDoList task={task} disabled={task.archived} />
          <Deadline task={task} disabled={task.archived} />
        </div>
        <Typography variant='caption' className={classes.caption}>
          ACTIONS
        </Typography>
        <div className={classes.buttonsContainer}>
          <Copy task={task} />
          <Watch
            usersWatching={task.usersWatching}
            taskId={task._id}
            taskIndex={taskIndex}
            listIndex={listIndex}
          />
          <Transfer
            task={task}
            currentListId={currentListId}
            taskIndex={taskIndex}
            listIndex={listIndex}
          />
          <Archive task={task} taskIndex={taskIndex} listIndex={listIndex} />
        </div>
      </div>
    );
  },
  (prevState, nextState) => {
    return equal(prevState, nextState);
  }
);

export default SideContent;
