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
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  console.log(users);
  return (
    <>
      <div className={classes.avatarGroup}>
        {users.slice(0, 3).map((user, index) => (
          <UserItem
            key={user.user._id}
            permissions={user.permissions}
            user={user.user}
            handleUserClick={(e) => handleUserClick(e.currentTarget, user)}
            zIndex={index === 0 ? 3 : index === 1 ? 2 : 1}
          />
        ))}
      </div>
      {users.length >= 4 && (
        <div
          className={classes.membersRemaining}
          onClick={(e) => setAnchorEl(e.currentTarget)}
        >
          <p>+{users.length - 3}</p>
        </div>
      )}
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
