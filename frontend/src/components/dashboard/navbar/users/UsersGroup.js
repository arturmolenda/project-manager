import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';

import UserItem from './UserItem';
import GroupMenu from './userMenus/GroupMenu';

const useStyles = makeStyles((theme) => ({
  avatarGroup: {
    display: 'flex',
    marginLeft: 10,
    '& > div': {
      marginLeft: -8,
    },
  },
  membersRemaining: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: theme.spacing(4),
    height: theme.spacing(4),
    borderRadius: 18,
    border: '2px solid #fafafa',
    marginLeft: -7,
    backgroundColor: '#bdbdbd',
    transition: 'background-color, .1s ease',
    cursor: 'pointer',
    '& p': {
      color: '#fff',
      fontSize: '19px',
      marginLeft: 4,
      marginRight: 4,
    },
    '&:hover': {
      backgroundColor: '#9a9797',
    },
  },
}));

const UsersGroup = ({
  users,
  handleUserClick,
  projectId,
  userPermissions,
  creatorId,
  maxUsers = 6,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '16px 0 8px -3px',
        }}
      >
        <div className={classes.avatarGroup}>
          {users.slice(0, maxUsers).map((user, index) => (
            <UserItem
              key={user.user._id}
              permissions={user.permissions}
              user={user.user}
              handleUserClick={(e) => handleUserClick(e.currentTarget, user)}
              zIndex={users.length - index}
            />
          ))}
        </div>
        {(users.length >= 7 || maxUsers === 0) && (
          <div
            className={classes.membersRemaining}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <p>+{users.length - maxUsers}</p>
          </div>
        )}
      </div>
      <GroupMenu
        anchorEl={anchorEl}
        handleClose={() => setAnchorEl(null)}
        users={users}
        projectId={projectId}
        creatorId={creatorId}
        userPermissions={userPermissions}
      />
    </>
  );
};

export default UsersGroup;
