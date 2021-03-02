import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import { makeStyles, Typography, MenuItem, Avatar } from '@material-ui/core';

import Notifications from './notifications/Notifications';
import UserModal from './UserModal';

const useStyles = makeStyles(() => ({
  userNav: {
    display: 'flex',
    margin: '10px 0 2px',
    height: 52,
  },

  navLink: {
    color: '#fff',
    textDecoration: 'none',
  },
}));

const UserNav = ({ navExpanded, mobile }) => {
  const { userInfo } = useSelector((state) => state.userLogin);
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  return (
    <>
      {userInfo && (
        <div
          className={classes.userNav}
          style={{
            justifyContent: navExpanded ? 'space-around' : 'center',
            visibility: !navExpanded && mobile && 'hidden',
          }}
        >
          {navExpanded && (
            <MenuItem style={{ paddingLeft: 5 }} onClick={() => setOpen(true)}>
              <Avatar
                style={{ marginRight: 10 }}
                alt={userInfo.username}
                src={userInfo.profilePicture}
              />
              <Typography variant='body2' noWrap>
                {userInfo.username}
              </Typography>
            </MenuItem>
          )}
          <Notifications />
        </div>
      )}
      <UserModal
        open={open}
        closeHandle={() => setOpen(false)}
        user={userInfo}
      />
    </>
  );
};

export default UserNav;
