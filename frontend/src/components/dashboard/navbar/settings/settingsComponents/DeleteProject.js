import React, { useState } from 'react';

import {
  makeStyles,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

import Header from './Header';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
    '& button': {
      marginRight: 40,
    },
  },
}));

const DeleteProject = () => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  const deleteHandle = () => {
    console.log('delete project');
  };

  return (
    <div className={classes.container}>
      <Header icon={DeleteIcon} title='Delete Project' />
      <Button
        variant='outlined'
        color='secondary'
        onClick={() => setOpen(true)}
      >
        Delete
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        BackdropProps={{ style: { backgroundColor: 'rgba(0, 0, 0, 0.3)' } }}
      >
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this project? This action cannot be
            undone
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={deleteHandle} variant='contained' color='secondary'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteProject;
