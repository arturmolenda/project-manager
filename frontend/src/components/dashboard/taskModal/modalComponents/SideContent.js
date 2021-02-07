import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import { makeStyles, Typography } from '@material-ui/core';

import Archive from './sideComponents/Archive';
import Copy from './sideComponents/Copy';
import Deadline from './sideComponents/Deadline';
import Label from './sideComponents/Label';
import ToDoList from './sideComponents/ToDoList';
import Transfer from './sideComponents/Transfer';
import Users from './sideComponents/users/Users';
import Watch from './sideComponents/Watch';

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

const SideContent = ({ task, task: { archived, _id: taskId } }) => {
  const {
    lists: { lists },
  } = useSelector((state) => state.projectGetData);
  const [currentListId, setCurrentListId] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    if (!archived) {
      const currentList = lists.find((list) => {
        const foundList = list.tasks.find((x) => x._id === taskId);
        return foundList && foundList._id;
      });
      if (currentList) setCurrentListId(currentList);
    }
  }, [lists, archived, taskId]);

  return (
    <div className={classes.container}>
      <Typography variant='caption' className={classes.caption}>
        ADD TO TASK
      </Typography>
      <div className={classes.buttonsContainer} style={{ marginBottom: 20 }}>
        <Users task={task} />
        <Label task={task} />
        <ToDoList task={task} />
        <Deadline task={task} />
      </div>
      <Typography variant='caption' className={classes.caption}>
        ACTIONS
      </Typography>
      <div className={classes.buttonsContainer}>
        <Copy task={task} />
        <Watch task={task} />
        <Transfer task={task} currentListId={currentListId} />
        <Archive task={task} />
      </div>
    </div>
  );
};

export default SideContent;
