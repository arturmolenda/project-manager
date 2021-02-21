import React from 'react';

import { useSelector } from 'react-redux';

import { Tooltip, Avatar, makeStyles } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';

const useStyles = makeStyles((theme) => ({
  innerContainer: {
    position: 'relative',
    border: 'initial',
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    cursor: 'pointer',
  },
  crownIcon: {
    position: 'absolute',
    transform: 'rotate(-155deg)',
    top: -6,
    right: 0,
  },
  avatarBorderFix: {
    border: '2px solid #fafafa',
    borderRadius: '50%',
    zIndex: 11,
    position: 'relative',
  },
  invitedUserBg: {
    cursor: 'pointer',
    background: 'rgba(255 255 255 / 0.55)',
    position: 'absolute',
    height: '100%',
    width: '100%',
    borderRadius: ' 50%',
    zIndex: 111,
  },
}));

const UserItem = ({
  handleUserClick,
  permissions,
  user,
  zIndex,
  allUsersMenu,
}) => {
  const { userInfo } = useSelector((state) => state.userLogin);
  const classes = useStyles();
  const userPicture =
    userInfo._id === user._id ? userInfo.profilePicture : user.profilePicture;

  return (
    <>
      {permissions === 2 && (
        <div style={{ zIndex }}>
          <Tooltip
            title={
              allUsersMenu ? user.username : `${user.username} (Administrator)`
            }
            onClick={handleUserClick}
          >
            <div className={classes.innerContainer}>
              <NotificationsIcon
                color='primary'
                className={classes.crownIcon}
              />
              <Avatar
                className={`${classes.avatar} ${classes.avatarBorderFix}`}
                src={userPicture}
              />
            </div>
          </Tooltip>
        </div>
      )}
      {permissions === 1 && (
        <div style={{ zIndex }}>
          <Tooltip title={user.username} onClick={handleUserClick}>
            <div className={classes.innerContainer}>
              <Avatar
                className={`${classes.avatar} ${classes.avatarBorderFix}`}
                src={userPicture}
              />
            </div>
          </Tooltip>
        </div>
      )}
      {permissions === 0 && (
        <div style={{ zIndex }}>
          <Tooltip
            title={allUsersMenu ? user.username : `${user.username} (Invited)`}
          >
            <div className={classes.innerContainer}>
              <div
                className={classes.invitedUserBg}
                onClick={handleUserClick}
              />
              <Avatar
                className={`${classes.avatar} ${classes.avatarBorderFix}`}
                src={userPicture}
              />
            </div>
          </Tooltip>
        </div>
      )}
    </>
  );
};

export default UserItem;
