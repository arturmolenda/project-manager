import React, { useState, useEffect, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { PROJECT_DATA_LIST_TITLE_UPDATE } from '../../../redux/constants/projectConstants';
import { taskFieldUpdate } from '../../../redux/actions/projectActions';

import { InputBase, makeStyles } from '@material-ui/core';

import Loader from '../../Loader';

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

const TitleUpdate = ({
  currentTitle,
  listIndex,
  projectId,
  taskId,
  disabled,
}) => {
  const dispatch = useDispatch();
  const { socket } = useSelector((state) => state.socketConnection);
  const [title, setTitle] = useState(currentTitle);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const titleRef = useRef();
  const classes = useStyles();

  useEffect(() => setTitle(currentTitle), [currentTitle]);

  const keyPressHandle = (e) => {
    if (e.key === 'Escape') titleRef.current.blur();
    else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (title === currentTitle) titleRef.current.blur();
      else if (title !== currentTitle && title.trim() !== '') {
        if (!isNaN(listIndex)) {
          socket.emit(
            'list-title-update',
            {
              title,
              projectId,
              listIndex,
            },
            () => {
              dispatch({
                type: PROJECT_DATA_LIST_TITLE_UPDATE,
                payload: { title, listIndex },
              });
              titleRef.current.blur();
            }
          );
        } else if (taskId) {
          setLoading(true);
          dispatch(
            taskFieldUpdate(taskId, projectId, title, 'title', () =>
              setLoading(false)
            )
          );
        }
      }
    }
  };
  const blurHandle = () => {
    if (!loading) setTitle(currentTitle);
    setOpen(false);
  };
  const focusHandle = () => {
    setOpen(true);
    titleRef.current.select();
  };
  return (
    <>
      {!isNaN(listIndex) && (
        <div
          className={!open && classes.dragFix}
          onClick={() => titleRef.current.focus()}
        />
      )}
      <div style={{ position: 'relative', width: '100%' }}>
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
          disabled={loading || disabled}
        />
        {loading && <Loader button />}
      </div>
    </>
  );
};

export default TitleUpdate;
