import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import { makeStyles, Typography } from '@material-ui/core';

import Archive from './sideComponents/Archive';
import Copy from './sideComponents/Copy';
import Deadline from './sideComponents/Deadline';
import Label from './sideComponents/Label';
import ToDoList from './sideComponents/ToDoList';
import Transfer from './sideComponents/Transfer';
import Users from './sideComponents/Users';
import Watch from './sideComponents/Watch';

const useStyles = makeStyles(() => ({
  container: {
    width: 168,
    height: 500,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingLeft: 10,
  },
  caption: {
    fontWeight: 600,
    color: '#979a9a',
  },
}));

const SideContent = ({ task }) => {
  const {
    lists: { lists },
  } = useSelector((state) => state.projectGetData);
  const [currentListId, setCurrentListId] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    const currentList = lists.find((list) => {
      const foundList = list.tasks.find((x) => x._id === task._id);
      return foundList && foundList._id;
    });
    if (currentList) setCurrentListId(currentList);
  }, [lists, task]);

  return (
    <div className={classes.container}>
      <Typography variant='caption' className={classes.caption}>
        ADD TO TASK
      </Typography>
      <div style={{ marginBottom: 20 }}>
        <Users task={task} />
        <Label task={task} />
        <ToDoList task={task} />
        <Deadline task={task} />
      </div>
      <Typography variant='caption' className={classes.caption}>
        ACTIONS
      </Typography>
      <div>
        <Copy task={task} />
        <Watch task={task} />
        <Transfer task={task} currentListId={currentListId} />
        <Archive task={task} />
      </div>
    </div>
  );
};

export default SideContent;
