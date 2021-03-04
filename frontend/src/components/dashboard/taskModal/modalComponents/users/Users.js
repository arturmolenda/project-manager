import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import { makeStyles, Tooltip, Typography, Avatar } from '@material-ui/core';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

import AddUsersMenu from '../sideComponents/users/AddUsersMenu';

const useStyles = makeStyles(() => ({
  avatarGroup: {
    display: 'inline-flex',
    cursor: 'pointer',
    '& > div:last-child': {
      width: 35,
      height: 35,
    },
  },
  avatar: {
    width: 35,
    height: 35,
    '&:first-child': { marginLeft: -1 },
  },
  caption: {
    margin: '5px 0',
    color: '#909090',
    fontSize: '.9rem',
    lineHeight: 1,
    fontWeight: 600,
  },
}));

const Users = ({ selectedUsers, projectId, taskId, disabled }) => {
  const { userInfo } = useSelector((state) => state.userLogin);
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  return (
    selectedUsers.length !== 0 && (
      <div style={{ margin: '8px 0' }}>
        <div>
          <Typography className={classes.caption} variant='body1'>
            Users
          </Typography>
          <AvatarGroup
            max={6}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            className={classes.avatarGroup}
          >
            {selectedUsers.map((user) => (
              <Tooltip title={user.username} key={user._id}>
                <Avatar
                  className={classes.avatar}
                  alt={user.username}
                  src={
                    userInfo._id === user._id
                      ? userInfo.profilePicture
                      : user.profilePicture
                  }
                />
              </Tooltip>
            ))}
          </AvatarGroup>
        </div>
        <AddUsersMenu
          anchorEl={anchorEl}
          selectedUsers={selectedUsers}
          projectId={projectId}
          taskId={taskId}
          handleClose={() => setAnchorEl(null)}
          disabled={disabled}
        />
      </div>
    )
  );
};

export default Users;
