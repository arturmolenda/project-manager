import React from 'react';

import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core';

import MenuHeader from '../../shared/MenuHeader';

const useStyles = makeStyles(() => ({
  container: {
    width: 270,
    maxHeight: 450,
    overflowY: 'auto',
  },
  menuItem: {
    fontSize: '.95rem',
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    padding: '6px 16px',
    margin: 0,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  disabledItem: {
    fontSize: '.95rem',
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    padding: '6px 16px',
    margin: 0,
    cursor: 'default',
    opacity: '0.5',
    pointerEvents: 'none',
    userSelect: 'none',
  },
}));

const TransferTasks = ({ handleClose, transferHandle, listId, title }) => {
  const { lists } = useSelector((state) => state.projectGetData);
  const classes = useStyles();
  return (
    <>
      <div style={{ marginBottom: 5 }}>
        <MenuHeader
          handleClose={handleClose}
          title={title ? title : 'Transfer tasks to other list'}
        />
      </div>
      <div className={classes.container}>
        {lists.lists &&
          lists.lists.length > 0 &&
          lists.lists.map((list, listIndex) => (
            <p
              key={list._id}
              className={
                list._id === listId ? classes.disabledItem : classes.menuItem
              }
              onClick={() =>
                list._id !== listId &&
                transferHandle(listIndex, list._id, handleClose)
              }
            >
              {list._id === listId ? `${list.title} (current)` : list.title}
            </p>
          ))}
      </div>
    </>
  );
};

export default TransferTasks;
