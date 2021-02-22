import React from 'react';

import { useSelector } from 'react-redux';

import { Dialog, Typography, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import ColorSelect from './settingsComponents/ColorSelect';
import DeleteProject from './settingsComponents/DeleteProject';

const useStyles = makeStyles(() => ({
  container: {
    padding: 10,
    backgroundColor: '#e6e6e6',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '2.9rem',
    padding: '5px 10px 5px 15px',
    color: '#fff',
    background: '#423f3f',
    '& svg': {
      cursor: 'pointer',
      '&:hover': {
        color: '#d2d2d2',
      },
    },
  },
}));

const SettingsModal = ({ open, handleClose }) => {
  const { project } = useSelector((state) => state.projectGetData);
  const { userInfo } = useSelector((state) => state.userLogin);
  const classes = useStyles();
  const projectTheme =
    userInfo.projectsThemes && userInfo.projectsThemes[project._id];
  return (
    <Dialog
      open={open}
      keepMounted
      fullWidth
      maxWidth='sm'
      onClose={handleClose}
    >
      <div className={classes.header}>
        <Typography variant='h6'>Settings</Typography>
        <CloseIcon onClick={handleClose} />
      </div>
      <div className={classes.container}>
        <ColorSelect
          colorTheme={projectTheme && projectTheme.mainColor}
          projectId={project._id}
        />
        {userInfo._id === project.creatorId && (
          <DeleteProject creatorId={project.creatorId} />
        )}
      </div>
    </Dialog>
  );
};

export default SettingsModal;
