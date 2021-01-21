import React, { useState, useRef } from 'react';

import { useSelector } from 'react-redux';

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

const useStyles = (listId, isOpen) =>
  makeStyles(() => ({
    container: listId
      ? {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          margin: '0 10px 6px',
        }
      : {
          display: 'flex',
          flexDirection: 'column',
          minWidth: 265,
          backgroundColor: '#eaeaea',
          margin: '0 10px 0 4px',
          padding: isOpen && '5.5px 5px',
          borderRadius: 3,
          '&:hover': {
            backgroundColor: !isOpen && '#cdcdcd',
          },
        },
    inputContainer: isOpen
      ? {
          display: 'flex',
          alignItems: 'flex-start',
          backgroundColor: '#fff',
          borderRadius: 5,
          border: '2px solid rgb(21, 192, 215)',
        }
      : {
          display: 'flex',
          alignItems: 'flex-start',
          backgroundColor: listId && '#fff',
          borderRadius: 5,
          padding: !listId && '11px 5px',
          border: '2px solid transparent',
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: listId && '#cdcdcd',
          },
        },
    inputTask: {
      display: 'flex',
      alignItems: 'flex-start',
      padding: '7px 0px',
      fontSize: '0.875rem',
    },
    addIconTask: {
      color: '#a3a3a3',
      marginTop: isOpen ? 18 : 19,
    },
    closeBtn: {
      padding: 6,
      marginLeft: 4,
    },
  }));

const AddInput = ({ listId, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const { socket } = useSelector((state) => state.socketConnection);
  const { project } = useSelector((state) => state.projectSetCurrent);
  const classes = useStyles(listId, isOpen)();
  const inputRef = useRef();
  const cancelHandle = () => {
    inputRef.current.blur();
    setIsOpen(false);
    setTitle('');
  };

  const keyPressHandle = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addAction();
    } else if (e.key === 'Escape') cancelHandle();
  };
  const focusHandle = () => {
    setIsOpen(true);
    if (listId) {
      animateScroll.scrollToBottom({
        duration: 150,
        containerId: listId,
      });
    } else document.getElementById('board-container').scrollLeft += 500;
  };

  const focusOutHandle = () => title === '' && setIsOpen(false);
  const preventBlurHandle = (e) => e.preventDefault();

  const addAction = () => {
    if (title.trim() !== '') {
      if (listId) {
        socket.emit(
          'add-task',
          { projectId: project._id, listId, title },
          () => {
            setTitle('');
            inputRef.current.focus();
          }
        );
      } else {
        socket.emit('add-list', { projectId: project._id, title }, () => {
          setTitle('');
          inputRef.current.focus();
          document.getElementById('board-container').scrollLeft += 1000;
        });
      }
    }
  };

  return (
    <div
      className={classes.container}
      onClick={() => !isOpen && inputRef.current.focus()}
    >
      <Input
        className={classes.inputContainer}
        id={listId && `task-input-${listId}`}
        inputRef={inputRef}
        onBlur={focusOutHandle}
        onFocus={focusHandle}
        variant='outlined'
        disableUnderline
        fullWidth
        multiline
        value={title}
        onKeyDown={keyPressHandle}
        onChange={(e) => setTitle(e.target.value)}
        style={{ cursor: !isOpen && 'pointer' }}
        inputProps={{
          style: { cursor: !isOpen && 'pointer' },
        }}
        startAdornment={
          <InputAdornment position='start'>
            <AddIcon className={classes.addIconTask} />
          </InputAdornment>
        }
        placeholder={placeholder}
      />
      {isOpen && (
        <div
          style={{ margin: '6px 0 4px 1px', width: '100%' }}
          onMouseDown={preventBlurHandle}
        >
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

export default AddInput;
