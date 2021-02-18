import React from 'react';

import { useSelector } from 'react-redux';

import { Menu, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  container: {
    outline: 'none',
    maxWidth: 110,
    maxHeight: 200,
  },
  menuItem: {
    cursor: 'pointer',
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    fontSize: '.85rem',
    padding: '6px 8px',
    margin: 0,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
}));

const TransferMenu = ({ anchorEl, closeHandle, transferActionHandle }) => {
  const { lists } = useSelector((state) => state.projectGetData);
  const classes = useStyles();
  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={closeHandle}
      getContentAnchorEl={null}
      transitionDuration={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <div className={classes.container}>
        {lists.lists &&
          lists.lists.length > 0 &&
          lists.lists.map((list, listIndex) => (
            <p
              key={list._id}
              onClick={() => transferActionHandle(listIndex, list._id)}
              className={classes.menuItem}
            >
              {list.title}
            </p>
          ))}
      </div>
    </Menu>
  );
};

export default TransferMenu;
