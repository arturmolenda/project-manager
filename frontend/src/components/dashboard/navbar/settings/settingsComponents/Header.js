import React from 'react';

import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  header: {
    padding: 5,
    display: 'flex',
    alignItems: 'center',
    '& svg': {
      marginRight: 10,
      height: theme.spacing(3.4),
      width: theme.spacing(3.4),
    },
    '& h6': {
      fontSize: '1.10rem',
    },
  },
}));

const Header = ({ icon, title }) => {
  const classes = useStyles();
  const Icon = icon;
  return (
    <div className={classes.header}>
      <Icon color='primary' />
      <Typography variant='h6'>{title}</Typography>
    </div>
  );
};

export default Header;
