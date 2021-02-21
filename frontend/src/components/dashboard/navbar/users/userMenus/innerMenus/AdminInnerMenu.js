import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  removeUserFromProject,
  updateUserPermissions,
} from '../../../../../../redux/actions/projectActions';

import { makeStyles, Avatar, MenuItem, Typography } from '@material-ui/core';

import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

import MenuHeader from '../../../../shared/MenuHeader';

const useStyles = makeStyles((theme) => ({
  menuAvatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    marginRight: 5,
  },
  menuContainer: {
    width: 290,
    outline: 'none',
    postition: 'relative',
  },
  userContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  userDetailsContainer: {
    padding: 10,
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  permissionsItem: {
    display: 'block',
    whiteSpace: 'normal',
    lineHeight: 1,
  },
  exitIcon: {
    position: 'absolute',
    right: 10,
    top: 12,
    width: 21,
    height: 21,
    fontSize: '1.3rem',
    cursor: 'pointer',
  },
  captionEmail: {
    color: '#8a8a8a',
  },
  username: {
    color: '#003a6d',
  },
}));

const AdminInnerMenu = ({
  user,
  profilePicture,
  permissions,
  projectOwner,
  projectId,
  handleClose,
  goBackHandle,
}) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userLogin);
  const [permissionsOpened, setPermissionsOpened] = useState(false);
  const classes = useStyles();

  const updatePermissionsHandle = () => {
    dispatch(
      updateUserPermissions(user._id, permissions, projectId, handleClose)
    );
  };

  const removeUserHandle = () => {
    dispatch(removeUserFromProject(user._id, projectId, handleClose));
  };

  let menu = (
    <div className={classes.menuContainer}>
      <>
        {goBackHandle && (
          <MenuHeader
            goBackHandle={goBackHandle}
            handleClose={handleClose}
            title='Member'
          />
        )}
        <div className={classes.userDetailsContainer}>
          <div className={classes.userContainer}>
            <Avatar src={profilePicture} className={classes.menuAvatar} />
            <div className={classes.userDetails}>
              <Typography className={classes.username} variant='subtitle1'>
                {user.username}
              </Typography>
              <Typography className={classes.captionEmail} variant='caption'>
                {user.email}
              </Typography>
            </div>
          </div>
          {!goBackHandle && (
            <CloseRoundedIcon
              className={classes.exitIcon}
              onClick={handleClose}
            />
          )}
        </div>
      </>
      {permissions === 0 && (
        <MenuItem onClick={removeUserHandle}>Withdraw invitation</MenuItem>
      )}
      {permissions === 1 && (
        <>
          <MenuItem
            onClick={() => setPermissionsOpened(true)}
            className={classes.heading}
          >
            Update Permissions (Normal)
          </MenuItem>

          <MenuItem onClick={removeUserHandle}>Remove</MenuItem>
        </>
      )}

      {projectOwner && (
        <>
          <MenuItem onClick={handleClose} disabled>
            Permissions... (Administrator)
          </MenuItem>

          <MenuItem onClick={handleClose} disabled>
            {user._id === userInfo._id ? 'Leave Project' : 'Remove'}
          </MenuItem>
        </>
      )}
      {permissions === 2 && !projectOwner && (
        <>
          <MenuItem
            onClick={() => setPermissionsOpened(true)}
            className={classes.heading}
          >
            Update Permissions (Administrator)
          </MenuItem>

          <MenuItem onClick={removeUserHandle}>
            {user._id === userInfo._id ? 'Leave Project' : 'Remove'}
          </MenuItem>
        </>
      )}
    </div>
  );
  if (permissionsOpened) {
    menu = (
      <div className={classes.menuContainer}>
        <MenuHeader
          goBackHandle={() => setPermissionsOpened(false)}
          handleClose={handleClose}
          title='Update Permissions'
        />
        <MenuItem
          disabled={permissions === 2}
          className={classes.permissionsItem}
          onClick={updatePermissionsHandle}
        >
          <Typography variant='subtitle1'>Administrator</Typography>
          <Typography variant='caption'>
            Can add and delete users, change permissions, assign users to tasks
            and change project theme
          </Typography>
        </MenuItem>
        <MenuItem
          disabled={permissions === 1}
          className={classes.permissionsItem}
          onClick={updatePermissionsHandle}
        >
          <Typography variant='subtitle1'>Normal</Typography>
          <Typography variant='caption'>
            Can add and edit tasks / lists, comment and send messages in the
            group chat
          </Typography>
        </MenuItem>
      </div>
    );
  }
  return menu;
};

export default AdminInnerMenu;
