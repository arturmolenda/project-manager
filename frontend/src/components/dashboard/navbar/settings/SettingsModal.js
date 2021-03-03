import React from 'react';

import { useSelector } from 'react-redux';

import { Dialog, Typography, makeStyles } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import ColorSelect from './settingsComponents/ColorSelect';
import DeleteProject from './settingsComponents/DeleteProject';
import Background from './settingsComponents/Background';

const useStyles = makeStyles(() => ({
  container: {
    padding: 10,
    backgroundColor: '#e6e6e6',
    overflowY: 'auto',
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
        <Background
          backgroundTheme={projectTheme && projectTheme.background}
          projectId={project._id}
          open={open}
        />
        {userInfo._id === project.creatorId && (
          <DeleteProject projectId={project._id} />
        )}
      </div>
    </Dialog>
  );
};

export default SettingsModal;
