import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/actions/userActions';

import {
  makeStyles,
  Tooltip,
  MenuItem,
  CircularProgress,
} from '@material-ui/core';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';

import NewProjectModal from './NewProjectModal';
import UserNav from './UserNav';
import ProjectSelect from './projectSelect/ProjectSelect';

const useStyles = makeStyles(() => ({
  iconMargin: {
    margin: '16px 0',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
  },
  menuItemContainer: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  hiddenMenu: {
    visibility: 'hidden',
  },
  menuText: {
    marginLeft: 15,
  },
}));

const NavLinks = ({ navExpanded, mobile }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { loading, userInfo } = useSelector((state) => state.userLogin);
  const dispatch = useDispatch();
  const classes = useStyles();
  return (
    <>
      {loading && (!mobile || (mobile && navExpanded)) ? (
        <CircularProgress style={{ margin: '5vh auto 0 auto' }} />
      ) : userInfo ? (
        <>
          <UserNav navExpanded={navExpanded} mobile={mobile} />
          <ProjectSelect navExpanded={navExpanded} mobile={mobile} />
          <NavLink
            to='/boards'
            className={`${classes.navLink} ${
              !navExpanded && mobile && classes.hiddenMenu
            }`}
          >
            <Tooltip placement='right' title={!navExpanded ? 'Boards' : ''}>
              <MenuItem className={navExpanded && classes.menuItemContainer}>
                <DashboardIcon className={classes.iconMargin} />
                <p
                  className={classes.menuText}
                  style={{ display: !navExpanded && 'none' }}
                >
                  Boards
                </p>
              </MenuItem>
            </Tooltip>
          </NavLink>
          <Tooltip placement='right' title={!navExpanded ? 'New Project' : ''}>
            <MenuItem
              className={
                navExpanded
                  ? classes.menuItemContainer
                  : mobile && classes.hiddenMenu
              }
              onClick={() => setModalOpen(true)}
            >
              <CreateNewFolderIcon className={classes.iconMargin} />
              <p
                className={classes.menuText}
                style={{ display: !navExpanded && 'none' }}
              >
                New Project
              </p>
            </MenuItem>
          </Tooltip>
          <Tooltip placement='right' title={!navExpanded ? 'Sign Out' : ''}>
            <MenuItem
              className={
                navExpanded
                  ? classes.menuItemContainer
                  : mobile && classes.hiddenMenu
              }
              onClick={() => dispatch(logout())}
            >
              <ExitToAppIcon className={classes.iconMargin} />
              <p
                className={classes.menuText}
                style={{ display: !navExpanded && 'none' }}
              >
                Sign Out
              </p>
            </MenuItem>
          </Tooltip>
          <NewProjectModal
            open={modalOpen}
            handleClose={() => setModalOpen(false)}
          />
        </>
      ) : (
        <>
          <NavLink
            to='/'
            className={`${classes.navLink} ${
              !navExpanded && mobile && classes.hiddenMenu
            }`}
          >
            <Tooltip placement='right' title={!navExpanded ? 'Home' : ''}>
              <MenuItem className={navExpanded && classes.menuItemContainer}>
                <DashboardIcon className={classes.iconMargin} />
                <p
                  className={classes.menuText}
                  style={{ display: !navExpanded && 'none' }}
                >
                  Home
                </p>
              </MenuItem>
            </Tooltip>
          </NavLink>

          <NavLink
            to='/signin'
            className={`${classes.navLink} ${
              !navExpanded && mobile && classes.hiddenMenu
            }`}
          >
            <Tooltip placement='right' title={!navExpanded ? 'Sign In' : ''}>
              <MenuItem className={navExpanded && classes.menuItemContainer}>
                <LockOpenIcon className={classes.iconMargin} />
                <p
                  className={classes.menuText}
                  style={{ display: !navExpanded && 'none' }}
                >
                  Sign In
                </p>
              </MenuItem>
            </Tooltip>
          </NavLink>

          <NavLink
            to='/register'
            className={`${classes.navLink} ${
              !navExpanded && mobile && classes.hiddenMenu
            }`}
          >
            <Tooltip placement='right' title={!navExpanded ? 'Register' : ''}>
              <MenuItem className={navExpanded && classes.menuItemContainer}>
                <VpnKeyIcon className={classes.iconMargin} />
                <p
                  className={classes.menuText}
                  style={{ display: !navExpanded && 'none' }}
                >
                  Register
                </p>
              </MenuItem>
            </Tooltip>
          </NavLink>
        </>
      )}
    </>
  );
};

export default NavLinks;
