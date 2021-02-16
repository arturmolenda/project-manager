import React, { useState } from 'react';

import { Avatar, Typography, makeStyles } from '@material-ui/core';
import CommentInput from './CommentInput';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  commentContainer: {
    display: 'flex',
    marginBottom: 10,
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginRight: 8,
    marginTop: 8,
  },
  username: {
    fontWeight: 600,
    marginRight: 6,
  },
  date: {
    color: '#9a989a',
  },
  comment: {
    wordBreak: 'break-all',
    marginRight: 40,
    display: 'inline-block',
    background: '#fff',
    padding: 5,
    borderRadius: 6,
    border: '1px solid #ccc',
    whiteSpace: 'pre-wrap',
  },
  actionText: {
    color: '#00bcd4',
    cursor: 'pointer',
    margin: '2px 5px',
  },
}));

const CommentItem = ({
  comment,
  openDeleteMenu,
  editCommentHandle,
  userId,
}) => {
  const [editOpen, setEditOpen] = useState(false);
  const classes = useStyles();
  return (
    <div className={classes.commentContainer}>
      <Avatar className={classes.avatar} src={comment.user.profilePicture} />
      <div>
        <Typography className={classes.username} variant='caption'>
          {comment.user.username}
        </Typography>
        <Typography className={classes.date} variant='caption'>
          {moment(comment.date).fromNow()} {comment.edited && ' (edited)'}
        </Typography>

        {editOpen ? (
          <CommentInput
            initialComment={comment.comment}
            editCommentHandle={editCommentHandle}
            commentId={comment._id}
            editCloseHandle={() => setEditOpen(false)}
          />
        ) : (
          <Typography variant='body2' className={classes.comment}>
            {comment.comment.trim()}
          </Typography>
        )}
        {!editOpen && comment.user._id === userId && (
          <div style={{ display: 'flex' }}>
            <p className={classes.actionText} onClick={() => setEditOpen(true)}>
              Edit
            </p>
            <p
              className={classes.actionText}
              onClick={(e) => openDeleteMenu(comment._id, e.currentTarget)}
            >
              Delete
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
