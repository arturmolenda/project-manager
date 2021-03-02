import React, { useEffect, useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { PROJECT_DATA_TITLE_UPDATE } from '../../../redux/constants/projectConstants';

import { makeStyles } from '@material-ui/core';

import AutosizeInput from 'react-input-autosize';

const useStyles = makeStyles((theme) => ({
  input: {
    '& input': {
      maxWidth: '100%',
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
      maxWidth: '100%',
      overflowX: 'hidden',
      textOverflow: 'ellipsis',
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
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socketConnection);
  const { project } = useSelector((state) => state.projectGetData);
  const [projectTitle, setProjectTitle] = useState(project.title);
  const [titleOpen, setTitleOpen] = useState(false);
  const inputRef = useRef();
  const classes = useStyles();

  useEffect(() => setProjectTitle(project.title), [project.title]);

  const keyPressHandle = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (projectTitle.trim() !== '' && projectTitle !== project.title) {
        socket.emit(
          'project-title-update',
          {
            title: projectTitle,
            projectId: project._id,
          },
          () => {
            dispatch({
              type: PROJECT_DATA_TITLE_UPDATE,
              payload: { title: projectTitle, projectId: project._id },
            });
            inputRef.current.blur();
          }
        );
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
    <div
      className={titleOpen ? classes.input : classes.inputDisabled}
      style={{  position: 'absolute', left: 50, right: 20 }}
    >
      <AutosizeInput
        ref={inputRef}
        style={{ maxWidth: '100%' }}
        value={projectTitle}
        onChange={(e) => setProjectTitle(e.target.value)}
        onKeyDown={keyPressHandle}
        spellCheck={false}
        onBlur={closeHandle}
        disabled={project.permissions !== 2}
        onClick={() => !titleOpen && openTitleInputHandle()}
      />
    </div>
  );
};

export default NavTitle;
