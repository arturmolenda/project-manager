import React from 'react';

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
  handleClick,
  userPermissions,
  user,
  index,
  zIndex,
  allUsersMenu,
}) => {
  const classes = useStyles();
  return (
    <>
      {userPermissions === 2 && (
        <div style={{ zIndex }}>
          <Tooltip
            title={
              allUsersMenu ? user.username : `${user.username} (Administrator)`
            }
            onClick={
              index === 0
                ? (event) => handleClick(event.currentTarget, index)
                : (event) => handleClick(event.currentTarget, index)
            }
          >
            <div className={classes.innerContainer}>
              <NotificationsIcon
                color='primary'
                className={classes.crownIcon}
              />
              <Avatar
                className={`${classes.avatar} ${classes.avatarBorderFix}`}
                src={user.profilePicture}
              />
            </div>
          </Tooltip>
        </div>
      )}
      {userPermissions === 1 && (
        <div style={{ zIndex }}>
          <Tooltip
            title={user.username}
            onClick={(event) => handleClick(event.currentTarget, index)}
          >
            <div className={classes.innerContainer}>
              <Avatar
                className={`${classes.avatar} ${classes.avatarBorderFix}`}
                src={user.profilePicture}
              />
            </div>
          </Tooltip>
        </div>
      )}
      {userPermissions === 0 && (
        <div style={{ zIndex }}>
          <Tooltip
            title={allUsersMenu ? user.username : `${user.username} (Invited)`}
          >
            <div className={classes.innerContainer}>
              <div
                className={classes.invitedUserBg}
                onClick={(event) => handleClick(event.currentTarget, index)}
              />
              <Avatar
                className={`${classes.avatar} ${classes.avatarBorderFix}`}
                src={user.profilePicture}
              />
            </div>
          </Tooltip>
        </div>
      )}
    </>
  );
};

export default UserItem;
