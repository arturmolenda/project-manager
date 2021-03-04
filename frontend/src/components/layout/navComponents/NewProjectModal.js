import React, { useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { createProject } from '../../../redux/actions/projectActions';
import { PROJECT_CREATE_RESET } from '../../../redux/constants/projectConstants';

import {
  Dialog,
  DialogActions,
  DialogTitle,
  TextField,
  Button,
  makeStyles,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import Loader from '../../Loader';
import ProjectSvg from '../../../images/ProjectSvg.svg';

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    margin: 15,
    paddingTop: 5,
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  container: {
    backgroundImage: `url(${ProjectSvg})`,
    backgroundPosition: 'revert',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    width: 570,
    minHeight: 249,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
  },
  actionsContainer: {
    padding: '7px 25px 0 25px',
    marginTop: 100,
    background: '#fff',
    [theme.breakpoints.down('xs')]: {
      padding: '7px 17px 0 17px',
      marginTop: 114,
    },
  },
}));

const NewProjectModal = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.projectCreate);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState('');
  const inputRef = useRef();
  const history = useHistory();
  const classes = useStyles();

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
      PaperProps={{
        className: classes.paperContainer,
      }}
    >
      <div className={classes.container}>
        <DialogTitle>Create New Project</DialogTitle>
        {error && <Alert severity='error'>{error}</Alert>}
        <div className={classes.actionsContainer}>
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
      </div>
    </Dialog>
  );
};

export default NewProjectModal;
