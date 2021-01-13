import React, { useState, useEffect, useRef } from 'react';
import { InputBase, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  input: {
    border: '2px solid transparent',
    padding: '4px 2px',
    marginRight: 29,
  },
  inputOpen: {
    border: `2px solid ${theme.palette.primary.main}`,
    padding: '4px 2px',
    marginRight: 29,
    backgroundColor: '#fff',
    borderRadius: 5,
    zIndex: 1,
  },
  dragFix: {
    cursor: 'pointer !important',
    zIndex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 34,
    bottom: 0,
  },
}));

const TitleUpdate = ({ currentTitle }) => {
  const [title, setTitle] = useState(currentTitle);
  const [open, setOpen] = useState(false);
  const titleRef = useRef();
  const classes = useStyles();

  useEffect(() => setTitle(currentTitle), [currentTitle]);

  const keyPressHandle = (e) => {
    if (e.key === 'Escape') titleRef.current.blur();
    if (title !== currentTitle && title.trim() !== '' && e.key === 'Enter') {
      console.log('action');
    }
  };
  const blurHandle = () => {
    setTitle(currentTitle);
    setOpen(false);
  };
  const focusHandle = () => {
    setOpen(true);
    titleRef.current.select();
  };
  return (
    <>
      <div
        className={!open && classes.dragFix}
        onClick={() => titleRef.current.focus()}
      />
      <InputBase
        inputRef={titleRef}
        className={open ? classes.inputOpen : classes.input}
        inputProps={{ spellCheck: false }}
        color='primary'
        onBlur={blurHandle}
        multiline
        value={title}
        fullWidth
        onMouseDown={(e) => e.stopPropagation()}
        onFocus={focusHandle}
        onKeyDown={keyPressHandle}
        onChange={(e) => setTitle(e.target.value)}
      />
    </>
  );
};

export default TitleUpdate;
