import React, { useState, useRef, useEffect } from 'react';

import { makeStyles, TextField, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: 'calc(100% - 50px)',
    border: '1px solid #ccc',
    background: '#fff',
    borderRadius: 6,
  },
  inputField: {
    '& 	.MuiInputBase-multiline': {
      fontSize: '.875rem',
      padding: '8px 6px',
    },
    '& fieldset': {
      border: 'none',
    },
  },
  actions: {
    marginTop: 10,
    padding: '0 0 6px 5px',
    alignItems: 'center',
    display: 'flex',
    '& svg': {
      cursor: 'pointer',
      marginLeft: 5,
    },
  },
}));

const CommentInput = ({
  commentId,
  commentIndex,
  editCommentHandle,
  addCommentHandle,
  initialComment,
  editCloseHandle,
  disabled,
}) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState('');
  const classes = useStyles();
  const inputRef = useRef();

  useEffect(() => initialComment && inputRef.current.select(), [
    initialComment,
  ]);

  const cancelHandle = () => {
    setCommentOpen(false);
    setComment('');
  };

  const commentOnTask = () => {
    if (comment.trim() === '') inputRef.current.select();
    else {
      initialComment
        ? editCommentHandle(commentId, comment, commentIndex, editCloseHandle)
        : addCommentHandle(comment, () => {
            inputRef.current.blur();
            cancelHandle();
          });
    }
  };
  const keyPressHandle = (e) => {
    if (e.key === 'Escape') {
      inputRef.current.blur();
      cancelHandle();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      commentOnTask();
    }
  };

  const openCommentHandle = () => {
    setCommentOpen(true);
  };

  return (
    <div className={classes.container}>
      <TextField
        id='comment'
        name='comment'
        type='text'
        inputRef={inputRef}
        placeholder='Write a comment'
        multiline
        variant='outlined'
        value={comment ? comment : addCommentHandle ? comment : initialComment}
        onChange={(e) => setComment(e.target.value)}
        className={classes.inputField}
        onKeyDown={keyPressHandle}
        fullWidth
        onFocus={openCommentHandle}
        InputProps={{ spellCheck: 'false' }}
        disabled={disabled}
      />
      {(commentOpen || initialComment) && (
        <div className={classes.actions}>
          <Button
            size='small'
            color='primary'
            variant='contained'
            onClick={commentOnTask}
          >
            {initialComment ? 'Save' : 'Comment'}
          </Button>
          <CloseIcon
            onClick={initialComment ? editCloseHandle : cancelHandle}
          />
        </div>
      )}
    </div>
  );
};

export default CommentInput;
