import React from 'react';

import { useSelector } from 'react-redux';

import {
  Avatar,
  CircularProgress,
  ClickAwayListener,
  Grow,
  makeStyles,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  container: {
    width: 286,
    minHeight: 50,
    maxHeight: 170,
    overflow: 'auto',
    padding: 4,
    marginTop: 10,
    borderRadius: 3,
    backgroundColor: '#fbfbfb',
    boxShadow: '0 8px 16px -4px rgba(9,30,66,.25), 0 0 0 1px rgba(9,30,66,.08)',
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  menuItem: {
    padding: '4px 6px',
    '& .MuiAvatar-circle': {
      width: 35,
      height: 35,
      fontSize: '1rem',
      marginRight: 10,
    },
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    overflowX: 'hidden',
    '& span': {
      color: '#9c9c9c',
      textOverflow: 'ellipsis',
      overflowX: 'hidden',
    },
    '& h6': {
      color: '#0f386b',
    },
  },
}));

const SearchMenu = ({
  clickAction,
  open,
  anchorEl,
  handleClose,
  usersToInvite,
}) => {
  const { loading, users, error } = useSelector(
    (state) => state.projectFindUsers
  );
  const { userInfo } = useSelector((state) => state.userLogin);
  const classes = useStyles();
  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      role={undefined}
      disablePortal
      transition
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} style={{ transformOrigin: 'center bottom' }}>
          <Paper className={classes.container}>
            <ClickAwayListener
              onClickAway={(e) => e.target !== anchorEl && handleClose()}
            >
              <MenuList style={{ outline: 'none' }}>
                {loading ? (
                  <CircularProgress
                    style={{
                      width: 40,
                      height: 40,
                      position: 'relative',
                      top: 'calc(50% - 20px)',
                      left: 'calc(50% - 20px)',
                    }}
                  />
                ) : users && users.length > 0 ? (
                  users.map((user) => (
                    <MenuItem
                      key={user._id}
                      className={classes.menuItem}
                      onClick={() => clickAction(user)}
                      disabled={
                        usersToInvite.findIndex((x) => x._id === user._id) !==
                          -1 || user.joinedStatus
                      }
                    >
                      {user.profilePicture ? (
                        <Avatar
                          src={
                            userInfo._id === user._id
                              ? userInfo.profilePicture
                              : user.profilePicture
                          }
                        />
                      ) : (
                        <Avatar>{user.username[0]}</Avatar>
                      )}
                      <div className={classes.userDetails}>
                        <Typography variant='subtitle2'>
                          {user.username} {user.joinedStatus}
                        </Typography>
                        <Typography variant='caption'>{user.email}</Typography>
                      </div>
                    </MenuItem>
                  ))
                ) : (
                  error && (
                    <Typography variant='subtitle2' align='center'>
                      {error}
                    </Typography>
                  )
                )}
              </MenuList>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
};

export default SearchMenu;
