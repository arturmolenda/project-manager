import React, { useState } from 'react';

import { makeStyles, Tooltip } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';

import SettingsModal from './SettingsModal.js';

const useStyles = makeStyles(() => ({
  icon: {
    display: 'flex',
    padding: 5,
    marginBottom: 3,
    cursor: 'pointer',
    color: '#fff',
    transition: '.2s ease',
    '&:hover': {
      background: '#ffffff21',
      borderRadius: 3,
    },
  },
}));

const Settings = (props) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  return (
    <>
      <Tooltip title='Settings'>
        <div className={classes.icon} onClick={() => setOpen(true)}>
          <SettingsIcon />
        </div>
      </Tooltip>
      <SettingsModal
        open={open}
        handleClose={() => setOpen(false)}
        project={props.project}
      />
    </>
  );
};

export default Settings;
