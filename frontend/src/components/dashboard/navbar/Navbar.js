import React from 'react';

import { makeStyles } from '@material-ui/core';
import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';

import NavTitle from './NavTitle';
import ArchivedTasks from './archivedTasks/ArchivedTasks';
import InviteUsers from './inviteUsers/InviteUsers';
import Users from './users/Users';
import Chat from './groupChat/Chat';
import Settings from './settings/Settings';

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
    margin: 'auto 10px auto 0px',
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
    <>
      <div className={classes.backgroundNav} />
      <div className={classes.container} style={{ position: 'fixed' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex' }}>
            <DeveloperBoardIcon color='primary' className={classes.boardIcon} />
            <NavTitle />
          </div>
          <Users />
          <InviteUsers />
        </div>

        <div className={classes.navIcons}>
          <Chat />
          <ArchivedTasks />
          <Settings />
        </div>
      </div>

      <div
        className={classes.container}
        style={{ visibility: 'hidden', marginBottom: 40 }}
      >
        <div style={{ display: 'flex' }}>
          <DeveloperBoardIcon color='primary' className={classes.boardIcon} />
        </div>
      </div>
    </>
  );
};

export default Navbar;
