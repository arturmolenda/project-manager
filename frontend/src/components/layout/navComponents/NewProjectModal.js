import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { createProject } from '../../../redux/actions/projectActions';
import { PROJECT_CREATE_RESET } from '../../../redux/constants/projectConstants';

import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import Loader from '../../Loader';

const NewProjectModal = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.projectCreate);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const inputRef = useRef();
  const history = useHistory();

  useEffect(() => {
    if (open) inputRef?.current?.focus();
    else {
      setTitle('');
      setTitleError('');
    }
  }, [open]);

  const keyDownHandle = (e) => {
    if (e.key === 'Enter') createProjectHandle();
  };

  const createProjectHandle = () => {
    if (title === '') setTitleError('Cannot be empty');
    else {
      dispatch(
        createProject(title, (projectId) => {
          history.push(`/project/${projectId}`);
          dispatch({ type: PROJECT_CREATE_RESET });
          setTitle('');
          handleClose();
        })
      );
    }
  };

  const changeHandle = (e) => {
    setTitle(e.target.value);
    setTitleError(false);
  };

  return (
    <Dialog
      open={open}
      keepMounted
      onClose={!loading ? handleClose : undefined}
    >
      <div style={{ width: 600 }}>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <TextField
            inputRef={inputRef}
            name='title'
            type='text'
            label='Title'
            variant='outlined'
            value={title}
            disabled={loading}
            onChange={changeHandle}
            onKeyDown={keyDownHandle}
            style={{ marginBottom: 10 }}
            fullWidth
            error={Boolean(titleError)}
            helperText={titleError}
          />
        </DialogContent>
        {error && <Alert severity='error'>{error}</Alert>}
        <DialogActions>
          <Button
            onClick={!loading ? handleClose : undefined}
            color='secondary'
          >
            Cancel
          </Button>
          <Button
            onClick={createProjectHandle}
            color='primary'
            disabled={loading}
          >
            Create
            {loading && <Loader button />}
          </Button>
        </DialogActions>
      </div>
    </Dialog>
  );
};

export default NewProjectModal;
