import React from 'react';

import { NavLink } from 'react-router-dom';
import { makeStyles, Tooltip, MenuItem } from '@material-ui/core';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import DashboardIcon from '@material-ui/icons/Dashboard';

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
  const classes = useStyles();
  return (
    <>
      <NavLink to='/' exact className={classes.navLink}>
        <Tooltip placement='right' title={!navExpanded ? 'Home' : ''}>
          <MenuItem
            className={
              navExpanded
                ? classes.menuItemContainer
                : mobile && classes.hiddenMenu
            }
          >
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

      <NavLink to='/signin' exact className={classes.navLink}>
        <Tooltip placement='right' title={!navExpanded ? 'Sign In' : ''}>
          <MenuItem
            className={
              navExpanded
                ? classes.menuItemContainer
                : mobile && classes.hiddenMenu
            }
          >
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

      <NavLink to='/register' exact className={classes.navLink}>
        <Tooltip placement='right' title={!navExpanded ? 'Register' : ''}>
          <MenuItem
            className={
              navExpanded
                ? classes.menuItemContainer
                : mobile && classes.hiddenMenu
            }
          >
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
  );
};

export default NavLinks;
