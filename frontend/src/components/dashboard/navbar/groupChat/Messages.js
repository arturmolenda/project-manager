import React, { useEffect, useRef } from 'react';

import { useSelector } from 'react-redux';

import { makeStyles, Typography, Avatar, Tooltip } from '@material-ui/core';

import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  scrollBottom: (props) => ({
    width: '100%',
    height: props.mobile ? '100%' : 350,
    overflowY: 'auto',
    '&:last-child': {
      paddingBottom: 5,
    },
    '&:first-child': {
      paddingTop: 5,
    },
  }),
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  avatarMessageContainer: {
    display: 'flex',
    maxWidth: '75%',
  },
  singleMessageContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    marginLeft: theme.spacing(4),
    maxWidth: '70%',
  },
  message: {
    backgroundColor: '#dfdfdf',
    padding: '6px 10px',
    borderRadius: '15px',
    color: '#000',
    margin: 1,
    wordBreak: 'break-word',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  messageSentContainer: {
    display: 'flex',
    width: 'fit-content',
    maxWidth: '70%',
    margin: '2px 10px 2px auto',
  },
  messageSent: {
    backgroundColor: '#0099ff',
    padding: '6px 10px',
    borderRadius: '15px',
    color: '#fff',
    wordBreak: 'break-word',
  },
  username: {
    color: '#a2a2a2',
    marginTop: 10,
    marginLeft: 42,
  },
}));

const Messages = ({ open, userId, mobile }) => {
  const { messages } = useSelector((state) => state.projectMessages);
  const containerRef = useRef();
  const classes = useStyles({ mobile });
  let lastMessage;

  const updateScroll = () => {
    if (containerRef.current)
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
  };

  const getDate = (date) => moment(date).format('Do MMM YYYY HH:mm');

  useEffect(() => {
    open && updateScroll();
  }, [messages, open]);

  return (
    <div ref={containerRef} className={classes.scrollBottom}>
      {messages.map((message, i) => {
        if (message.user._id === userId) {
          lastMessage = message;
          return (
            <Tooltip
              PopperProps={{
                disablePortal: true,
                popperOptions: {
                  modifiers: {
                    preventOverflow: { boundariesElement: 'window' },
                  },
                },
              }}
              title={getDate(message.createdAt)}
              placement='left'
              key={message._id}
            >
              <div className={classes.messageSentContainer}>
                <Typography variant='body2' className={classes.messageSent}>
                  {message.message}
                </Typography>
              </div>
            </Tooltip>
          );
        } else if (lastMessage && lastMessage.user._id === message.user._id) {
          lastMessage = message;
          return (
            <div className={classes.singleMessageContainer} key={message._id}>
              <Tooltip
                PopperProps={{
                  disablePortal: true,
                  popperOptions: {
                    positionFixed: true,
                    modifiers: {
                      preventOverflow: {
                        enabled: true,
                        boundariesElement: 'window', // where "window" is the boundary
                      },
                    },
                  },
                }}
                title={getDate(message.createdAt)}
                placement='left'
              >
                <div className={classes.textContainer}>
                  <Typography variant='body2' className={classes.message}>
                    {message.message}
                  </Typography>
                </div>
              </Tooltip>
            </div>
          );
        } else {
          lastMessage = message;
          return (
            <div key={message._id}>
              <Typography variant='caption' className={classes.username}>
                {message.user.username}
              </Typography>
              <div className={classes.avatarMessageContainer}>
                <Avatar
                  className={classes.avatar}
                  alt={message.user.username}
                  src={message.user.profilePicture}
                />
                <Tooltip
                  PopperProps={{
                    disablePortal: true,
                    popperOptions: {
                      positionFixed: true,
                      modifiers: {
                        preventOverflow: {
                          enabled: true,
                          boundariesElement: 'window', // where "window" is the boundary
                        },
                      },
                    },
                  }}
                  title={getDate(message.createdAt)}
                  placement='left'
                >
                  <div className={classes.textContainer}>
                    <Typography variant='body2' className={classes.message}>
                      {message.message}
                    </Typography>
                  </div>
                </Tooltip>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default Messages;
