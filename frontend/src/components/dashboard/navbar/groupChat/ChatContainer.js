import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { sendMessage } from '../../../../redux/actions/projectActions';

import {
  makeStyles,
  Typography,
  Paper,
  InputAdornment,
  Input,
  Modal,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import SendIcon from '@material-ui/icons/Send';

import Messages from './Messages';

const useStyles = makeStyles(() => ({
  container: {
    position: 'fixed',
    maxHeight: 450,
    width: 350,
    zIndex: 10,
    right: 0,
    bottom: 10,
    margin: '0 10px 10px 0',
  },
  mobileContainer: {
    background: '#fff',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    outline: 'none',
    borderRadius: 0,
  },
  cardHeader: {
    backgroundColor: '#f8f9fc',
    padding: 10,
    borderBottom: '1px solid #d0d3dc',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    display: 'flex',
    justifyContent: 'space-between',
    transition: 'background-color 0.2s ease',
  },
  cardBody: {
    display: 'flex',
    paddingLeft: 5,
    maxHeight: 350,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageTextfield: {
    height: 50,
    '&:hover:before': {
      borderBottomColor: 'transparent !important',
    },
    '& input': {
      background: '#e4e4e4',
      padding: '7px 15px',
      borderRadius: 16,
      margin: '0 7px',
      transition: '.1s ease',
      '&:focus, &:hover': {
        background: '#d8d8d8',
      },
    },
  },
  sendBtn: {
    color: '#535353',
    cursor: 'pointer',
    margin: '4px 10px 0 0',
    '&:hover': {
      color: '#000',
    },
  },
}));

const ChatContainer = ({ closeChat, open, mobile }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userLogin);
  const classes = useStyles();
  const [message, setMessage] = useState('');

  const sendMessageAction = () => {
    if (message !== '') dispatch(sendMessage(message, () => setMessage('')));
  };

  const keyDownHandle = (e) => {
    if (e.key === 'Enter' && message !== '') sendMessageAction();
  };

  const chatBody = (
    <Paper
      elevation={3}
      className={mobile ? classes.mobileContainer : classes.container}
      style={{ display: !mobile && (open ? 'initial' : 'none') }}
    >
      <div className={classes.cardHeader}>
        <Typography variant='body1'>Group Chat</Typography>
        <CloseIcon style={{ cursor: 'pointer' }} onClick={closeChat} />
      </div>
      <Messages userId={userInfo._id} open={open} mobile={mobile} />
      <Input
        placeholder='Message'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className={classes.messageTextfield}
        fullWidth
        onKeyDown={keyDownHandle}
        inputProps={{ spellCheck: 'false' }}
        endAdornment={
          <InputAdornment position='end'>
            <div className={classes.sendBtn} onClick={sendMessageAction}>
              <SendIcon />
            </div>
          </InputAdornment>
        }
      />
    </Paper>
  );

  return (
    <>
      {mobile ? (
        <Modal open={open} disableScrollLock onClose={closeChat}>
          {chatBody}
        </Modal>
      ) : (
        chatBody
      )}
    </>
  );
};

export default ChatContainer;
