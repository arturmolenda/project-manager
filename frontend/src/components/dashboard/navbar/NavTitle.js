import React, { useEffect, useRef, useState } from 'react';

import { makeStyles } from '@material-ui/core';

import AutosizeInput from 'react-input-autosize';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  input: {
    '& input': {
      fontSize: '1.2rem',
      color: theme.palette.primary.main,
      backgroundColor: '#fff !important',
      border: '2px solid rgb(21, 192, 215)',
      borderRadius: 5,
      padding: '2px 3px',
      outline: 'none',
    },
  },
  inputDisabled: {
    '& input': {
      margin: 0,
      padding: '2px 3px',
      background: 'transparent',
      border: '2px solid transparent',
      color: theme.palette.primary.main,
      fontSize: '1.2rem',
      cursor: 'text',
      outline: 'none',
    },
  },
}));

const NavTitle = () => {
  const { project } = useSelector((state) => state.projectGetData);
  const [projectTitle, setProjectTitle] = useState(project.title);
  const [titleOpen, setTitleOpen] = useState(false);
  const inputRef = useRef();
  const classes = useStyles();

  useEffect(() => setProjectTitle(project.title), [project.title]);

  const keyPressHandle = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (projectTitle.trim() !== '') {
        closeHandle();
        // action
      }
    } else if (e.key === 'Escape') inputRef.current.blur();
  };

  const openTitleInputHandle = () => {
    setTitleOpen(true);
    inputRef.current.select();
  };

  const closeHandle = () => {
    setTitleOpen(false);
    setProjectTitle(project.title);
  };

  return (
    <AutosizeInput
      ref={inputRef}
      className={titleOpen ? classes.input : classes.inputDisabled}
      value={projectTitle}
      onChange={(e) => setProjectTitle(e.target.value)}
      onKeyDown={keyPressHandle}
      spellCheck={false}
      onBlur={closeHandle}
      disabled={project.permissions !== 2}
      onClick={() => !titleOpen && openTitleInputHandle()}
    />
  );
};

export default NavTitle;