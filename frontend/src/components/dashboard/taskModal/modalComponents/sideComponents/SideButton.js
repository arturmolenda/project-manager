import React from 'react';
import { Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  btn: {
    border: '1px solid transparent',
    height: 32,
    width: '100%',
    textTransform: 'none',
    display: 'flex',
    justifyContent: 'flex-start',
    background: '#e7e7e7',
    marginBottom: 10,
    '& svg': {
      marginLeft: 6,
    },
    '&:hover': {
      background: '#d3d3d3',
    },
    [theme.breakpoints.down('sm')]: {
      width: 'calc(50% - 8px)',
      marginRight: 8,
    },
  },
  secondaryBtn: {
    border: '1px solid transparent',
    height: 32,
    width: '100%',
    textTransform: 'none',
    display: 'flex',
    justifyContent: 'flex-start',
    background: '#ff3d00',
    marginBottom: 10,
    '& svg': {
      marginLeft: 6,
    },
    '&:hover': {
      background: '#b22a00',
    },
    [theme.breakpoints.down('sm')]: {
      width: 'calc(50% - 8px)',
      marginRight: 8,
    },
  },
}));

const SideButton = ({
  icon,
  text,
  secondary,
  clickHandle,
  styleProps,
  disabled,
}) => {
  const classes = useStyles();
  return (
    <Button
      startIcon={icon}
      className={secondary ? classes.secondaryBtn : classes.btn}
      onClick={clickHandle}
      disabled={disabled}
      style={{ ...styleProps }}
    >
      {text}
    </Button>
  );
};

export default SideButton;
