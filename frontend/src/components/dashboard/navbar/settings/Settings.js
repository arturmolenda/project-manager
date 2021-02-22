import React, { useState } from 'react';

import { makeStyles, Tooltip } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';

import SettingsModal from './SettingsModal.js';

const useStyles = makeStyles((theme) => ({
  icon: {
    display: 'flex',
    marginBottom: 3,
    padding: 5,
    cursor: 'pointer',
    color: '#6b7082',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}));

const Settings = (props) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  return (
    <>
      <div className={classes.icon} onClick={() => setOpen(true)}>
        <Tooltip title='Settings'>
          <SettingsIcon />
        </Tooltip>
      </div>
      <SettingsModal
        open={open}
        handleClose={() => setOpen(false)}
        project={props.project}
      />
    </>
  );
};

export default Settings;
