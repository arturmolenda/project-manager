import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ListMenu from './ListMenu';

const useStyles = makeStyles((theme) => ({
  icon: {
    position: 'absolute',
    top: 3,
    right: 0,
    padding: 5,
    cursor: 'pointer',
    color: '#6b7082',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}));

const ListMore = ({ listId, listIndex }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  return (
    <>
      <div
        className={classes.icon}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <MoreVertIcon />
      </div>
      <ListMenu
        anchorEl={anchorEl}
        handleClose={() => setAnchorEl(null)}
        listId={listId}
        listIndex={listIndex}
      />
    </>
  );
};

export default ListMore;
