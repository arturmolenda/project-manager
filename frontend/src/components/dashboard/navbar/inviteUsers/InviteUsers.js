import React, { useState } from 'react';

import { makeStyles, Tooltip } from '@material-ui/core';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import AddUserMenu from './AddUserMenu';

const useStyles = makeStyles((theme) => ({
  icon: {
    display: 'flex',
    padding: 5,
    marginBottom: 1,
    cursor: 'pointer',
    color: '#6b7082',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}));
const InviteUsers = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();

  return (
    <>
      <div
        className={classes.icon}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <Tooltip title='Invite Users'>
          <PersonAddIcon />
        </Tooltip>
      </div>
      <AddUserMenu handleClose={() => setAnchorEl(null)} anchorEl={anchorEl} />
    </>
  );
};

export default InviteUsers;
