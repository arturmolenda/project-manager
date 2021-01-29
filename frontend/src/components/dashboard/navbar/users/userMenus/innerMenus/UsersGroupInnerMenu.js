import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

import UserItem from '../../UserItem';
import MenuHeader from '../../../../shared/MenuHeader';

const useStyles = makeStyles(() => ({
  allUsersMenuContainer: {
    width: 290,
    outline: 'none',
    position: 'relative',
  },
  overflowContainer: {
    maxHeight: 350,
    overflow: 'auto',
  },
  sectionContainer: {
    marginLeft: 8,
  },
  usersContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  captionText: {
    fontWeight: 700,
    color: '#6f6e6e',
  },
}));

const UsersGroupInnerMenu = ({
  administrators,
  normalUsers,
  invitedUsers,
  handleClose,
  handleUserClick,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.allUsersMenuContainer}>
      <MenuHeader handleClose={handleClose} title='Project Members' />
      <div className={classes.overflowContainer}>
        <div className={classes.sectionContainer}>
          <Typography variant='caption' className={classes.captionText}>
            Administrators
          </Typography>
          <div className={classes.usersContainer}>
            {administrators.length !== 0 &&
              administrators.map((user) => (
                <UserItem
                  key={user.user._id}
                  handleUserClick={() => handleUserClick(user)}
                  user={user.user}
                  permissions={user.permissions}
                  allUsersMenu={true}
                />
              ))}
          </div>
        </div>
        {normalUsers.length !== 0 && (
          <div className={classes.sectionContainer}>
            <Typography variant='caption' className={classes.captionText}>
              Users
            </Typography>
            <div className={classes.usersContainer}>
              {normalUsers.map((user) => (
                <UserItem
                  key={user.user._id}
                  handleUserClick={() => handleUserClick(user)}
                  user={user.user}
                  permissions={user.permissions}
                  allUsersMenu={true}
                />
              ))}
            </div>
          </div>
        )}
        {invitedUsers.length !== 0 && (
          <div className={classes.sectionContainer}>
            <Typography variant='caption' className={classes.captionText}>
              Invited
            </Typography>
            <div className={classes.usersContainer}>
              {invitedUsers.map((user) => (
                <UserItem
                  key={user.user._id}
                  handleUserClick={() => handleUserClick(user)}
                  user={user.user}
                  permissions={user.permissions}
                  allUsersMenu={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersGroupInnerMenu;
