import React from 'react';
import { Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  btn: {
    height: 32,
    width: '100%',
    textTransform: 'none',
    display: 'flex',
    justifyContent: 'flex-start',
    background: '#e7e7e7',
    marginBottom: 10,
    '&:hover': {
      background: '#d3d3d3',
    },
  },
  secondaryBtn: {
    height: 32,
    width: '100%',
    textTransform: 'none',
    display: 'flex',
    justifyContent: 'flex-start',
    background: '#ff3d00',
    marginBottom: 10,
    '&:hover': {
      background: '#b22a00',
    },
  },
}));

const SideButton = ({ icon, text, secondary }) => {
  const classes = useStyles();
  return (
    <Button
      color='primary'
      variant='Contained'
      startIcon={icon}
      className={secondary ? classes.secondaryBtn : classes.btn}
    >
      {text}
    </Button>
  );
};

export default SideButton;
