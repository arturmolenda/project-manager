import React from 'react';

import { makeStyles } from '@material-ui/core';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';

import NavTitle from './NavTitle';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 5,
    height: 'auto',
    zIndex: 1,
  },
  backgroundNav: {
    borderBottom: '1px solid #d8d8d8',
    background: '#ffffffd9',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: 51,
  },
  boardIcon: {
    fontSize: 40,
  },
  navIcons: {
    display: 'flex',
    position: 'fixed',
    top: 8,
    right: 8,
  },
}));

const Navbar = () => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.backgroundNav} />
      <div
        className={classes.container}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <DeveloperBoardIcon color='primary' className={classes.boardIcon} />
        <NavTitle />
      </div>
    </div>
  );
};

export default Navbar;
