import React, { useState, useEffect, useRef } from 'react';

import { InputBase, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  input: {
    border: '2px solid transparent',
    padding: '4px 2px',
    marginRight: 10,
  },
  inputOpen: {
    border: `2px solid ${theme.palette.primary.main}`,
    padding: '4px 2px',
    marginRight: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    zIndex: 1,
  },
}));

const ToDoTitleUpdate = ({ currentTitle, updateHandle, disabled }) => {
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);
  const titleRef = useRef();
  const classes = useStyles();

  useEffect(() => setTitle(currentTitle), [currentTitle]);

  const keyPressHandle = (e) => {
    if (e.key === 'Escape') titleRef.current.blur();
    if (e.key === 'Enter') {
      e.preventDefault();
      if (title === currentTitle || title.trim() === '') {
        titleRef.current.blur();
      } else
        updateHandle(title, () => setTimeout(() => titleRef.current.blur(), 1));
    }
  };
  const blurHandle = () => {
    setOpen(false);
    setTitle(currentTitle);
  };
  const focusHandle = () => {
    setOpen(true);
    titleRef.current.select();
  };
  return (
    <InputBase
      inputRef={titleRef}
      className={open ? classes.inputOpen : classes.input}
      inputProps={{ spellCheck: false }}
      color='primary'
      onBlur={blurHandle}
      multiline
      value={title}
      fullWidth
      onFocus={focusHandle}
      onKeyDown={keyPressHandle}
      onChange={(e) => setTitle(e.target.value)}
      disabled={disabled}
    />
  );
};

export default ToDoTitleUpdate;
