import React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    justifyContent: 'flex-end',
    margin: '3px 4px 7px 0',
  },
  text: {
    textDecoration: 'underline',
    cursor: 'pointer',
    color: '#6b6b6b',
    margin: 0,
    '&:hover': {
      color: '#2f2f2f',
    },
    '&:first-child': {
      marginRight: 7,
    },
  },
}));

const ArchivedActions = ({
  taskId,
  taskIndex,
  openTransferMenu,
  openDeleteMenu,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <p
        className={classes.text}
        onClick={(e) => openTransferMenu(e.currentTarget, taskIndex, taskId)}
      >
        Transfer to list
      </p>
      <p
        className={classes.text}
        onClick={(e) => openDeleteMenu(e.currentTarget, taskIndex, taskId)}
      >
        Delete
      </p>
    </div>
  );
};

export default ArchivedActions;
