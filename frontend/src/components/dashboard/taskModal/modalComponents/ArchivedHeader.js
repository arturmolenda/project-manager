import React from 'react';

import { makeStyles, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(() => ({
  container: {
    backgroundColor: '#90e0ff',
    backgroundImage:
      'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.5) 35px, rgba(255,255,255,.5) 61px)',
    minHeight: 52,
    padding: '12px 12px 12px 19px',
    display: 'flex',
    '& svg': {
      marginRight: 15,
    },
  },
}));

const ArchivedHeader = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <DeleteIcon />
      <Typography variant='subtitle1'>This task is archived</Typography>
    </div>
  );
};

export default ArchivedHeader;
