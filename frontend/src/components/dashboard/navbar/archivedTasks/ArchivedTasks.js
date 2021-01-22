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
    color: '#6b7082',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}));

const ArchivedTasks = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();

  return (
    <div>
      <div
        className={classes.icon}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <Tooltip title='Archived Tasks'>
          <RestoreFromTrashIcon />
        </Tooltip>
      </div>
      <ArchivedMenu anchorEl={anchorEl} handleClose={() => setAnchorEl(null)} />
    </div>
  );
};

export default ArchivedTasks;
