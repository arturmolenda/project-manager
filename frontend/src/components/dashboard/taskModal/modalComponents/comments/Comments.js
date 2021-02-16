import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import { makeStyles, Avatar, Typography } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';

import CommentItem from './CommentItem';
import CommentInput from './CommentInput';
import DeleteMenu from '../../../shared/DeleteMenu';

const useStyles = makeStyles(() => ({
  header: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 15,
    '& svg': {
      marginRight: 15,
    },
  },
  commentsContainer: {
    margin: '10px 40px 0 0',
  },
  userInputContainer: {
    margin: '15px 0px 8px 0px',
    display: 'flex',
  },
  avatar: {
    width: 35,
    height: 35,
    marginRight: 10,
  },
}));

const Comments = ({ comments, projectId, taskId }) => {
  const { userInfo } = useSelector((state) => state.userLogin);
  const [anchorEl, setAnchorEl] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const classes = useStyles();

  const openDeleteMenu = (id, anchor) => {
    setCommentToDelete(id);
    setAnchorEl(anchor);
  };
  const deleteComment = () => {
    console.log('delete comment action');
    setCommentToDelete(null);
    setAnchorEl(null);
  };

  const editCommentHandle = (commentId, comment) => {
    console.log('edit comment action');
  };
  const addCommentHandle = (comment) => {
    console.log('add comment action');
  };

  return (
    <>
      <div className={classes.header}>
        <ChatIcon color='primary' />
        <Typography variant='body1'>Comments</Typography>
      </div>
      <div className={classes.userInputContainer}>
        <Avatar className={classes.avatar} src={userInfo.profilePicture} />
        <CommentInput addCommentHandle={addCommentHandle} />
      </div>
      <div className={classes.commentsContainer}>
        {comments &&
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              openDeleteMenu={openDeleteMenu}
              editCommentHandle={editCommentHandle}
            />
          ))}
      </div>
      <DeleteMenu
        anchorEl={anchorEl}
        handleClose={() => setAnchorEl(null)}
        headerTitle='Delete comment?'
        deleteHandle={deleteComment}
        text={'Deleting a comment cannot be undone, are you sure?'}
      />
    </>
  );
};

export default Comments;
