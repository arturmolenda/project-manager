import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';

import { useSelector } from 'react-redux';
import Notifications from './notifications/Notifications';

const useStyles = makeStyles((theme) => ({
  userNav: {
    display: 'flex',
    margin: '10px 0',
    height: 52,
  },

  navLink: {
    color: '#fff',
    textDecoration: 'none',
  },
}));

const UserNav = ({ navExpanded, mobile }) => {
  const classes = useStyles();
  const { userInfo } = useSelector((state) => state.userLogin);
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
            <MenuItem style={{ paddingLeft: 5 }}>
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
    </>
  );
};

export default UserNav;
