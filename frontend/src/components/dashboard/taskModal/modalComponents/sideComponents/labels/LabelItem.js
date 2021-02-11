import React from 'react';

import { makeStyles, Typography } from '@material-ui/core';

import DoneIcon from '@material-ui/icons/Done';
import CreateIcon from '@material-ui/icons/Create';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    '&:last-child': {
      marginBottom: 0,
    },
  },
  label: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 32,
    borderRadius: 3,
    padding: 9,
    margin: '5px 0',
    userSelect: 'none',
    color: '#fff',
    cursor: 'pointer',
    '&:hover': {
      height: 38,
      margin: '2px 0',
    },
  },
  createIcon: {
    marginLeft: 5,
    cursor: 'pointer',
    padding: 7,
    borderRadius: 5,
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.07)',
    },
  },
}));

const LabelItem = ({ label, taskLabels, editHandle, selectHandle }) => {
  const classes = useStyles();
  const labelSelected = taskLabels.includes(label._id);
  return (
    <div className={classes.container}>
      <div
        className={classes.label}
        onClick={() => selectHandle(label._id, labelSelected)}
        style={{
          backgroundColor: label.color,
          border: label.color === '#FFF' && '1px solid #bec0c0',
          color: label.color === '#FFF' && '#000',
        }}
      >
        <Typography variant='subtitle2' style={{ fontWeight: 600 }}>
          {label.title && label.title}
        </Typography>
        {labelSelected && <DoneIcon fontSize='small' />}
      </div>
      <CreateIcon
        className={classes.createIcon}
        onClick={() => editHandle(label)}
        fontSize='large'
      />
    </div>
  );
};

export default LabelItem;
