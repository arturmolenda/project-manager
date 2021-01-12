import React, { useState, useRef } from 'react';

import {
  makeStyles,
  InputAdornment,
  Input,
  Button,
  IconButton,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';

import { animateScroll } from 'react-scroll';

const useStyles = makeStyles(() => ({
  inputContainer: {
    width: '90%',
    margin: '4px auto',
    backgroundColor: '#fff',
    borderRadius: 5,
    border: '2px solid transparent',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#cdcdcd',
    },
  },
  inputContainerOpen: {
    width: '90%',
    margin: '4px auto',
    backgroundColor: '#fff',
    borderRadius: 5,
    border: '2px solid rgb(21, 192, 215)',
  },
  inputTask: {
    display: 'flex',
    alignItems: 'flex-start',
    padding: '7px 0px',
    fontSize: '0.875rem',
  },
  addIconTask: {
    color: '#a3a3a3',
    marginTop: 18,
  },
  closeBtn: {
    padding: 6,
    marginLeft: 4,
  },
}));

const AddTask = ({ listId }) => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef();
  const cancelHandle = () => {
    inputRef.current.blur();
    setIsOpen(false);
    setTitle('');
  };

  const keyPressHandle = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (title.trim() !== '') addAction();
    }
  };
  const focusHandle = () => {
    inputRef.current.focus();
    setIsOpen(true);
    animateScroll.scrollToBottom({
      duration: 150,
      containerId: listId,
    });
  };
  const focusOutHandle = () => title === '' && setIsOpen(false);

  const addAction = () => {
    //   Add new task
    setTitle('');
    inputRef.current.focus();
  };

  const preventBlurHandle = (e) => e.preventDefault();

  return (
    <div onMouseDown={preventBlurHandle}>
      <div
        className={isOpen ? classes.inputContainerOpen : classes.inputContainer}
        onClick={focusHandle}
      >
        <Input
          className={classes.inputTask}
          inputRef={inputRef}
          onBlur={focusOutHandle}
          onFocus={focusHandle}
          variant='outlined'
          disableUnderline
          fullWidth
          multiline
          value={title}
          onKeyPress={keyPressHandle}
          onChange={(e) => setTitle(e.target.value)}
          style={{ cursor: !isOpen && 'pointer' }}
          inputProps={{
            style: { cursor: 'pointer' },
          }}
          startAdornment={
            <InputAdornment position='start'>
              <AddIcon className={classes.addIconTask} />
            </InputAdornment>
          }
          placeholder={'Add new task'}
        />
      </div>
      {isOpen && (
        <div style={{ margin: listId ? '0 0 6px 15px' : '6px 0' }}>
          <Button variant='contained' color='primary' onClick={addAction}>
            Add
          </Button>
          <IconButton className={classes.closeBtn} onClick={cancelHandle}>
            <ClearIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default AddTask;
