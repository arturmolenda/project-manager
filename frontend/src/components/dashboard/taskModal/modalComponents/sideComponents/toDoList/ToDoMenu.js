import React, { useRef, useState } from 'react';

import { useDispatch } from 'react-redux';
import { createToDoList } from '../../../../../../redux/actions/projectActions';

import {
  Button,
  makeStyles,
  Popover,
  TextField,
  Typography,
} from '@material-ui/core';

import Loader from '../../../../../Loader';
import MenuHeader from '../../../../shared/MenuHeader';

const useStyles = makeStyles(() => ({
  container: {
    width: 270,
    marginTop: 10,
    padding: '0 10px',
  },
  textfieldContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  caption: {
    fontWeight: 600,
    color: '#979a9a',
  },
  textfield: {
    marginBottom: 15,
    '& input': {
      padding: '6px 8px',
    },
  },
}));

const ToDoMenu = ({ anchorEl, handleClose, projectId, taskId }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const classes = useStyles();
  const closeHandle = () => {
    setTitle('');
    handleClose();
  };
  const saveHandle = () => {
    if (title === '') inputRef.current.focus();
    else {
      setLoading(true);
      dispatch(
        createToDoList(taskId, projectId, title, () => {
          setLoading(false);
          setTitle('');
          handleClose();
        })
      );
    }
  };

  const keyPressHandle = (e) => {
    if (e.key === 'Enter') saveHandle();
  };

  return (
    <Popover
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={closeHandle}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transitionDuration={0}
    >
      <div style={{ padding: '8px 0' }}>
        <MenuHeader handleClose={closeHandle} title='Add To-Do List' />
        <div className={classes.container}>
          <div className={classes.textfieldContainer}>
            <Typography variant='caption' className={classes.caption}>
              Title
            </Typography>
            <TextField
              inputRef={inputRef}
              variant='outlined'
              className={classes.textfield}
              value={title}
              onKeyDown={keyPressHandle}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <Button
            color='primary'
            variant='contained'
            onClick={saveHandle}
            disabled={loading}
          >
            Add
            {loading && <Loader button />}
          </Button>
        </div>
      </div>
    </Popover>
  );
};

export default ToDoMenu;
