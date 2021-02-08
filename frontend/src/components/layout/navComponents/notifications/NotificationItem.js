import React from 'react';
import { Link } from 'react-router-dom';

import {
  makeStyles,
  Typography,
  IconButton,
  Avatar,
  MenuItem,
  Button,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import {
  ProjectInvitation,
  RemovedFromProject,
  TaskAssignment,
} from './NotificationConstants';

import moment from 'moment';

const useStyles = makeStyles(() => ({
  notificationContainer: {
    borderBottom: '1px solid #e8e2e2',
    padding: 10,
  },
  notificationFlexContainer: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
  notificationMessage: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    marginLeft: 10,
  },
  notificationCaption: {
    color: '#979a9a',
    fontSize: '0.71rem',
  },
  notificationDescription: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  btnActions: {
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: '100%',
    background: '#f0f8ffd6',
    height: '100%',
    alignItems: 'center',
    '& button': {
      backgroundColor: '#f0f8ff',
      '&:nth-child(1)': {
        marginRight: 10,
      },
      '&:nth-child(1):hover': {
        background: '#ffedf1',
      },
      '&:nth-child(2):hover': {
        background: '#d5f9ff',
      },
    },
  },
  closeBtn: {
    position: 'absolute',
    top: 3,
    right: 3,
    padding: 5,
  },
}));

const NotificationItem = ({
  projectNotificationHandle,
  discardNotificationHandle,
  actionHandle,
  notificationsIndexes,
  notification,
  index,
}) => {
  const classes = useStyles();
  return (
    <div style={{ position: 'relative' }}>
      <MenuItem
        className={classes.notificationContainer}
        onClick={() => projectNotificationHandle(index)}
        disabled={notificationsIndexes.indexOf(index) !== -1}
      >
        <div className={classes.notificationFlexContainer}>
          <Link to={`/profile/${notification.senderId}`}>
            <Avatar
              className={classes.avatar}
              src={`http://localhost:5000/images/${notification.sender.profilePicture}`}
            />
          </Link>
          <div className={classes.notificationMessage}>
            <Typography
              variant='caption'
              className={classes.notificationCaption}
            >
              {notification.type}
            </Typography>
            <Typography
              variant='body2'
              className={classes.notificationDescription}
            >
              {(notification.type === ProjectInvitation && (
                <span>
                  <strong>{notification.sender.username}</strong>
                  {' invited you to join project: '}
                  <strong>{`"${notification.project.title}"`}</strong>
                </span>
              )) ||
                (notification.type === TaskAssignment && (
                  <span>
                    <strong>{notification.sender.username}</strong>
                    {' assigned you to task: '}
                    <strong>{`"${notification.task.title}"`}</strong>
                  </span>
                )) ||
                (notification.type === RemovedFromProject && (
                  <span>
                    <strong>{notification.sender.username}</strong>
                    {notification.description.split(':')[0]}
                    <strong>{notification.description.split(':')[1]}</strong>
                  </span>
                ))}
            </Typography>
            <Typography
              variant='caption'
              className={classes.notificationCaption}
            >
              {moment(notification.createdAt).fromNow()}
            </Typography>
          </div>
        </div>
      </MenuItem>
      {notificationsIndexes.indexOf(index) !== -1 && (
        <div className={classes.btnActions}>
          <Button
            color='secondary'
            onClick={() => discardNotificationHandle(notification._id, index)}
            style={{
              marginRight: notification.type === RemovedFromProject && 0,
            }}
          >
            Discard
          </Button>
          {notification.type !== RemovedFromProject && (
            <Button
              variant='outlined'
              color='primary'
              onClick={() => actionHandle(notification)}
            >
              {notification.type === ProjectInvitation ? 'Join' : 'Open'}
            </Button>
          )}
          <IconButton
            color='secondary'
            className={classes.closeBtn}
            onClick={() => projectNotificationHandle(index)}
          >
            <CloseIcon />
          </IconButton>
        </div>
      )}
    </div>
  );
};

export default NotificationItem;
