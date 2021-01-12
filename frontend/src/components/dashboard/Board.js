import { makeStyles } from '@material-ui/core';
import React from 'react';
import { useSelector } from 'react-redux';
import Lists from './lists/Lists';
import Navbar from './navbar/Navbar';

const useStyles = makeStyles(() => ({
  boardContainer: {
    height: '100vh',
    position: 'relative',
  },

  board: {
    height: '100vh',
    display: 'grid',
    flexWrap: 'nowrap',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    padding: '0 4px',
    overflowX: 'auto',
  },
}));

const Board = () => {
  const { project, labels, tasks } = useSelector(
    (state) => state.projectGetData
  );
  const classes = useStyles();
  return (
    <div className={classes.boardContainer}>
      <Navbar />
      <div className={classes.board}>
        <Lists />
      </div>
    </div>
  );
};

export default Board;
