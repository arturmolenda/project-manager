import React from 'react';

import { Avatar, makeStyles, Typography } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    cursor: 'pointer',
    userSelect: 'none',
    '&:hover': {
      backgroundColor: '#dedede',
    },
  },
  innerContainer: {
    display: 'flex',
    alignItems: 'center',
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
  },
  avatar: {
    marginRight: 10,
    height: 30,
    width: 30,
  },
  textEllipsis: {
    textOverflow: 'ellipsis',
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
  },
}));

const UserItem = ({ profilePicture, username, selected, clickHandle }) => {
  const classes = useStyles();
  return (
    <div className={classes.container} onClick={clickHandle}>
      <div className={classes.innerContainer}>
        <Avatar src={profilePicture} className={classes.avatar} />
        <Typography variant='subtitle2' className={classes.textEllipsis}>
          {username}
        </Typography>
      </div>
      {selected && (
        <CheckCircleOutlineIcon style={{ color: '#818181', marginRight: 10 }} />
      )}
    </div>
  );
};

export default UserItem;
