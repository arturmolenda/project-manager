import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import { makeStyles, Tooltip, Badge } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import ChatContainer from './ChatContainer';

const useStyles = makeStyles((theme) => ({
  icon: {
    display: 'flex',
    padding: 5,
    cursor: 'pointer',
    color: '#6b7082',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  chatOpen: {
    display: 'block',
  },
  chatClosed: {
    display: 'none',
    transition: '1s ease-out',
  },
}));

const Chat = () => {
  const { socket } = useSelector((state) => state.socketConnection);
  const [open, setOpen] = useState(false);
  const [newMessage, setNewMessage] = useState(false);
  const classes = useStyles();

  const openHandle = () => {
    setOpen(true);
    setNewMessage(false);
    setTimeout(() => {
      const element = document.getElementById('messages-container');
      element.scrollTop = element.scrollHeight;
    }, 1);
  };

  useEffect(() => {
    socket.on('new-message', () => {
      if (!open) setNewMessage(true);
    });
  }, [socket, open]);

  return (
    <>
      <div onClick={openHandle} className={classes.icon}>
        <Tooltip title='Chat'>
          <Badge
            color='secondary'
            variant='dot'
            invisible={!(newMessage && !open)}
          >
            <ChatIcon />
          </Badge>
        </Tooltip>
      </div>
      <div className={open ? classes.chatOpen : classes.chatClosed}>
        <ChatContainer closeChat={() => setOpen(false)} open={open} />
      </div>
    </>
  );
};

export default Chat;
