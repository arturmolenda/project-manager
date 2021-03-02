import React, { useState } from 'react';
import { makeStyles, Tooltip } from '@material-ui/core';
import RestoreFromTrashIcon from '@material-ui/icons/RestoreFromTrash';
import ArchivedMenu from './ArchivedMenu';

const useStyles = makeStyles((theme) => ({
  icon: {
    display: 'flex',
    padding: 5,
    marginBottom: 2,
    cursor: 'pointer',
    color: '#fff',
    transition: '.2s ease',
    '&:hover': {
      background: '#ffffff21',
      borderRadius: 3,
    },
  },
}));

const ArchivedTasks = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();

  return (
    <>
      <Tooltip title='Archived Tasks'>
        <div
          className={classes.icon}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <RestoreFromTrashIcon />
        </div>
      </Tooltip>
      <ArchivedMenu anchorEl={anchorEl} handleClose={() => setAnchorEl(null)} />
    </>
  );
};

export default ArchivedTasks;
