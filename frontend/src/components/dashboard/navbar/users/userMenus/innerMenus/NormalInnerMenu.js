import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { removeUserFromProject } from '../../../../../../redux/actions/projectActions';

import { makeStyles, Typography, Avatar, MenuItem } from '@material-ui/core';

import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

import MenuHeader from '../../../../shared/MenuHeader';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiDialog-paperScrollPaper': {
      width: '90%',
    },
  },

  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    cursor: 'pointer',
  },
  menuAvatar: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    marginRight: 5,
  },
  addUserBtn: {
    marginRight: 15,
  },
  exitIcon: {
    position: 'absolute',
    right: 16,
    top: 12,
    width: 21,
    height: 21,
    fontSize: '1.3rem',
    cursor: 'pointer',
  },

  menuContainer: {
    width: 290,
    outline: 'none',
  },
  userDetailsContainer: {
    display: 'flex',
    padding: 10,
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  avatarsContainer: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: 20,
  },
  crownIcon: {
    position: 'absolute',
    color: '#e4ca0b',
    transform: 'rotate(-27deg)',
    top: -13,
    left: -5,
  },
  avatarBorderFix: {
    borderRadius: '50%',
    zIndex: 11,
    position: 'relative',
  },
}));

const NormalInnerMenu = ({
  handleClose,
  profilePicture,
  user,
  permissions,
  projectId,
  goBackHandle,
}) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userLogin);
  const classes = useStyles();

  const removeUserHandle = () => {
    dispatch(removeUserFromProject(user._id, projectId, handleClose));
  };
  return (
    user && (
      <div className={classes.menuContainer}>
        {goBackHandle && (
          <MenuHeader
            goBackHandle={goBackHandle}
            handleClose={handleClose}
            title='Member'
          />
        )}

        <div className={classes.userDetailsContainer}>
          <Avatar src={profilePicture} className={classes.menuAvatar} />
          <div className={classes.userDetails}>
            <Typography variant='subtitle1'>{user.username}</Typography>
            <Typography variant='caption'>{user.email}</Typography>
          </div>
        </div>
        {!goBackHandle && (
          <CloseRoundedIcon
            className={classes.exitIcon}
            onClick={handleClose}
          />
        )}
        {user._id === userInfo._id && (
          <>
            <MenuItem disabled>Permissions... (Normal)</MenuItem>

            <MenuItem onClick={removeUserHandle}>Leave Project</MenuItem>
          </>
        )}
        {permissions === 1 && user._id !== userInfo._id && (
          <MenuItem disabled>Permissions... (Normal)</MenuItem>
        )}
        {permissions === 2 && (
          <MenuItem disabled>Permissions... (Administrator)</MenuItem>
        )}
        {permissions === 0 && (
          <MenuItem disabled>Permissions... (Invited)</MenuItem>
        )}
      </div>
    )
  );
};

export default NormalInnerMenu;
