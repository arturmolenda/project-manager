import React, { useState } from 'react';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from '@material-ui/core';

const NewProjectModal = ({ open, handleClose }) => {
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');

  const createProjectHandle = () => {
    if (title === '') setTitleError('Cannot be empty');
    // ADD dispatch
  };

  const changeHandle = (e) => {
    setTitle(e.target.value);
    setTitleError(false);
  };

  return (
    <Dialog open={open} keepMounted onClose={handleClose}>
      <div style={{ width: 600 }}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <TextField
            name='title'
            type='text'
            label='Title'
            variant='outlined'
            style={{ marginBottom: 10 }}
            fullWidth
            error={Boolean(titleError)}
            helperText={titleError}
            onChange={changeHandle}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='secondary'>
            Cancel
          </Button>
          <Button onClick={createProjectHandle} color='primary'>
            Create
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default NewProjectModal;
