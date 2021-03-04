import React, { useEffect, useRef, useState } from 'react';

import {
  Button,
  ClickAwayListener,
  InputBase,
  makeStyles,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  textfieldOpen: {
    backgroundColor: '#fff',
    border: `2px solid ${theme.palette.primary.main}`,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    borderRadius: 5,
    '& textarea': {
      minHeight: 40,
      padding: '0 8px 5px 8px',
    },
  },
  initialTitleOpen: {
    backgroundColor: '#e6e6e6',
    border: `1px solid #cbcbcb`,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    borderRadius: 5,
    '& textarea': {
      minHeight: 40,
      padding: '0 8px 5px 8px',
    },
  },
  finishedText: {
    color: '#6a6a6a',
    textDecoration: 'line-through',
  },
  buttonsContainer: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    '& > svg': {
      cursor: 'pointer',
      marginLeft: 5,
    },
  },
}));

const ToDoInput = ({
  initialTitle = '',
  taskFinished = false,
  taskId = false,
  taskIndex,
  updateTaskTitleHandle,
  addTaskHandle,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const inputRef = useRef();
  const classes = useStyles();

  useEffect(() => !open && setTitle(initialTitle), [open, initialTitle]);

  const closeHandle = () => {
    setOpen(false);
    if (initialTitle) {
      setTitle(initialTitle);
      focused && inputRef.current.blur();
    }
  };

  const addTaskCallback = () => {
    setTitle('');
  };

  const focusInput = () => {
    setFocused(true);
    setOpen(true);
    setTimeout(() => inputRef.current.select(), 1);
  };

  const actionHandle = () => {
    if (title.trim() !== '')
      taskId
        ? updateTaskTitleHandle(taskId, title, taskIndex, () => setOpen(false))
        : addTaskHandle(title, addTaskCallback);
  };

  const keyPressHandle = (e) => {
    if (e.key === 'Escape') {
      inputRef.current.blur();
      closeHandle();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      actionHandle();
    }
  };

  return (
    <div
      style={{
        margin: !taskId && '10px 40px 0',
        width: taskId ? '100%' : '90%',
      }}
    >
      {!taskId && !open && (
        <Button color='primary' onClick={focusInput} disabled={disabled}>
          Add task
        </Button>
      )}
      <ClickAwayListener onClickAway={(e) => open && !focused && closeHandle()}>
        <div>
          {(open || taskId) && (
            <InputBase
              inputRef={inputRef}
              className={
                open
                  ? taskId
                    ? classes.initialTitleOpen
                    : classes.textfieldOpen
                  : taskFinished
                  ? classes.finishedText
                  : ''
              }
              style={{
                fontSize: 14,
                cursor: !open && taskId && !disabled && 'pointer',
              }}
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              variant='outlined'
              onFocus={!disabled && focusInput}
              onClick={() => !disabled && setOpen(true)}
              inputProps={{
                spellCheck: false,
                style: { cursor: !open && taskId && !disabled && 'pointer' },
              }}
              onBlur={() => setFocused(false)}
              multiline
              onKeyDown={keyPressHandle}
              placeholder={!taskId ? 'Add task' : ''}
              disabled={disabled}
            />
          )}
          {open && (
            <div className={classes.buttonsContainer}>
              <Button
                color='primary'
                variant='contained'
                size='small'
                onClick={actionHandle}
              >
                {taskId ? 'Save' : 'Add'}
              </Button>
              <CloseIcon onClick={closeHandle} />
            </div>
          )}
        </div>
      </ClickAwayListener>
    </div>
  );
};

export default ToDoInput;
