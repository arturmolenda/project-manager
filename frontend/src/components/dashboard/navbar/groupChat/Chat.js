import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { PROJECT_RESET_NEW_MESSAGE } from '../../../../redux/constants/projectConstants';

import { makeStyles, Tooltip, Badge } from '@material-ui/core';
import ChatIcon from '@material-ui/icons/Chat';
import ChatContainer from './ChatContainer';

const useStyles = makeStyles(() => ({
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

const Chat = ({ mobile, hide }) => {
  const dispatch = useDispatch();
  const { newMessage } = useSelector((state) => state.projectMessages);
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    if (open && newMessage) dispatch({ type: PROJECT_RESET_NEW_MESSAGE });
  }, [dispatch, open, newMessage]);

  const openHandle = () => {
    setOpen((prevState) => !prevState);
    dispatch({ type: PROJECT_RESET_NEW_MESSAGE });
  };

  return (
    <>
      <Tooltip title='Chat' style={{ display: hide && 'none' }}>
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
      <ChatContainer
        closeChat={() => setOpen(false)}
        open={open}
        mobile={mobile}
      />
    </>
  );
};

export default Chat;
