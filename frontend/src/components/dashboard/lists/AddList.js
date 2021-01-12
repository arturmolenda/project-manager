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

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 265,
    backgroundColor: '#eaeaea',
    margin: '0 8px 0 4px',
    padding: '6px 5px',
    borderRadius: 3,
    '&:hover': {
      backgroundColor: '#cdcdcd',
    },
  },
  input: {
    borderRadius: 5,
    border: '2px solid transparent',
  },
  openInput: {
    background: 'rgb(255, 255, 255)',
    border: '2px solid rgb(21, 192, 215)',
    borderRadius: 5,
  },
  addIcon: {
    color: '#a3a3a3',
    marginBottom: 2,
  },
  closeBtn: {
    padding: 6,
    marginLeft: 4,
  },
}));

const Add = () => {
  const classes = useStyles();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const inputRef = useRef();

  const keyPressHandle = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (title.trim() !== '') addAction();
    }
  };
  const focusHandle = () => {
    console.log('xd');
    inputRef.current.focus();
    setIsOpen(true);
    document.getElementById('board-container').scrollLeft += 500;
  };
  const focusOutHandle = () => {
    if (title === '') setIsOpen(false);
  };

  const addAction = () => {
    setTitle('');
  };

  const preventBlurHandle = (e) => e.preventDefault();

  const cancelHandle = () => {
    console.log('here', isOpen);
    setIsOpen(false);
    inputRef.current.blur();
    setTitle('');
  };

  return (
    <div
      onMouseDown={preventBlurHandle}
      onClick={!isOpen && focusHandle}
      className={classes.container}
      style={{
        paddingBottom: isOpen && 0,
        background: isOpen && '#eaeaea',
        cursor: isOpen ? 'auto' : 'pointer',
      }}
    >
      <div>
        <Input
          className={isOpen ? classes.openInput : classes.input}
          inputRef={inputRef}
          onBlur={focusOutHandle}
          onFocus={focusHandle}
          variant='outlined'
          disableUnderline
          fullWidth
          value={title}
          placeholder='Add new '
          onKeyPress={keyPressHandle}
          onChange={(e) => setTitle(e.target.value)}
          style={{ cursor: !isOpen && 'pointer', margin: 0 }}
          inputProps={{
            style: { fontSize: '0.875rem', cursor: !isOpen && 'pointer' },
          }}
          startAdornment={
            <InputAdornment position='start'>
              <AddIcon className={classes.addIcon} />
            </InputAdornment>
          }
        />
      </div>
      {isOpen && (
        <div style={{ margin: '6px 0', zIndex: 111 }}>
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

export default Add;
