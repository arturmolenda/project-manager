import React from 'react';

import { makeStyles, Avatar } from '@material-ui/core';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

const useStyles = makeStyles(() => ({
  avatarsContainer: {
    justifyContent: 'flex-end',
    '& > div': {
      height: 30,
      width: 30,
      borderColor: '#ececec',
    },
    '& > div:last-child': {
      fontSize: '1rem',
    },
  },
}));

const TaskUsers = ({ users }) => {
  const classes = useStyles();
  return (
    <AvatarGroup max={4} className={classes.avatarsContainer}>
      {users.map((user) => (
        <Avatar key={user._id} src={user.profilePicture} />
      ))}
    </AvatarGroup>
  );
};

export default TaskUsers;
