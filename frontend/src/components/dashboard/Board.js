import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { PROJECT_GET_DATA_ADD_TASK } from '../../redux/constants/projectConstants';

import { makeStyles } from '@material-ui/core';

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
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socketConnection);
  const { project, labels, tasks } = useSelector(
    (state) => state.projectGetData
  );
  const classes = useStyles();

  useEffect(() => {
    socket.on('new-task', (data) => {
      dispatch({ type: PROJECT_GET_DATA_ADD_TASK, payload: data });
    });
  }, [dispatch, socket]);

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
