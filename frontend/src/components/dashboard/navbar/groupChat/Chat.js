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
    color: '#fff',
    transition: '.2s ease',
    '&:hover': {
      background: '#ffffff21',
      borderRadius: 3,
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
    setOpen((prevState) => !prevState);
    setNewMessage(false);
    setTimeout(() => {
      const element = document.getElementById('messages-container');
      element.scrollTop = element.scrollHeight;
    }, 1);
  };

  useEffect(() => {
    socket.on('new-message', () => {
      console.log('new message', open);
      if (!open) setNewMessage(true);
    });
    return () => {
      socket.off('new-message');
    };
  }, [socket, open]);

  return (
    <>
      <Tooltip title='Chat'>
        <div onClick={openHandle} className={classes.icon}>
          <Badge
            color='secondary'
            variant='dot'
            invisible={!(newMessage && !open)}
          >
            <ChatIcon />
          </Badge>
        </div>
      </Tooltip>
      <ChatContainer closeChat={() => setOpen(false)} open={open} />
    </>
  );
};

export default Chat;
