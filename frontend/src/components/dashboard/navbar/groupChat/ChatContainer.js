import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import {
  makeStyles,
  Tooltip,
  Typography,
  Paper,
  TextField,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import Messages from './Messages';
import { sendMessage } from '../../../../redux/actions/projectActions';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'fixed',
    maxHeight: 450,
    width: 350,
    zIndex: 10,
    right: 0,
    bottom: 10,
    margin: '0 10px 10px 0',
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
  descriptionTextArea: {
    '& input': {
      padding: 12,
    },
  },
}));

const ChatContainer = ({ closeChat, open }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.userLogin);
  const classes = useStyles();
  const [message, setMessage] = useState('');

  const keyDownHandle = (e) => {
    if (e.key === 'Enter' && message !== '')
      dispatch(sendMessage(message, () => setMessage('')));
  };

  return (
    <Paper elevation={3} className={classes.container}>
      <div className={classes.cardHeader}>
        <Typography variant='body1' color='primary'>
          Group Chat
        </Typography>
        <Tooltip title='Close' placement='top' arrow>
          <CloseIcon
            color='primary'
            style={{ cursor: 'pointer' }}
            onClick={closeChat}
          />
        </Tooltip>
      </div>
      <div className={classes.cardBody}>
        <Messages userId={userInfo._id} open={open} />
      </div>
      <TextField
        placeholder='Message'
        variant='filled'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className={classes.descriptionTextArea}
        fullWidth
        onKeyDown={keyDownHandle}
        inputProps={{ spellCheck: 'false' }}
      />
    </Paper>
  );
};

export default ChatContainer;
