import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { makeStyles, Avatar, Typography } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';

import CommentItem from './CommentItem';
import CommentInput from './CommentInput';
import DeleteMenu from '../../../shared/DeleteMenu';
import {
  addComment,
  deleteComment,
  editComment,
} from '../../../../../redux/actions/projectActions';

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

const Comments = ({ comments, projectId, taskId, disabled }) => {
  const { userInfo } = useSelector((state) => state.userLogin);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const classes = useStyles();

  const openDeleteMenu = (id, index, anchor) => {
    setCommentToDelete({ id, index });
    setAnchorEl(anchor);
  };
  const deleteCommentHandle = () => {
    dispatch(
      deleteComment(
        taskId,
        projectId,
        commentToDelete.id,
        commentToDelete.index,
        () => {
          setCommentToDelete(null);
          setAnchorEl(null);
        }
      )
    );
  };

  const editCommentHandle = (commentId, comment, commentIndex, callback) => {
    dispatch(
      editComment(taskId, projectId, commentId, comment, commentIndex, callback)
    );
  };
  const addCommentHandle = (comment, callback) => {
    dispatch(addComment(taskId, projectId, comment, callback));
  };

  return (
    <>
      <div className={classes.header}>
        <ChatIcon color='primary' />
        <Typography variant='body1'>Comments</Typography>
      </div>
      <div className={classes.userInputContainer}>
        <Avatar className={classes.avatar} src={userInfo.profilePicture} />
        <CommentInput addCommentHandle={addCommentHandle} disabled={disabled} />
      </div>
      <div className={classes.commentsContainer}>
        {comments &&
          comments.map((comment, index) => (
            <CommentItem
              key={comment._id}
              commentIndex={index}
              comment={comment}
              profilePicture={
                userInfo._id === comment.user._id
                  ? userInfo.profilePicture
                  : comment.user.profilePicture
              }
              openDeleteMenu={openDeleteMenu}
              editCommentHandle={editCommentHandle}
              userId={userInfo._id}
            />
          ))}
      </div>
      <DeleteMenu
        anchorEl={anchorEl}
        handleClose={() => setAnchorEl(null)}
        headerTitle='Delete comment?'
        deleteHandle={deleteCommentHandle}
        text={'Deleting a comment cannot be undone, are you sure?'}
      />
    </>
  );
};

export default Comments;
