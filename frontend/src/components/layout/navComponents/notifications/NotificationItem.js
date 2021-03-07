import React, { useRef } from 'react';
import { Link } from 'react-router-dom';

import {
  makeStyles,
  Typography,
  IconButton,
  Avatar,
  MenuItem,
  Button,
  Tooltip,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import {
  NewComment,
  NewComments,
  NewToDoList,
  NewToDoLists,
  ProjectInvitation,
  RemovedFromProject,
  TaskArchived,
  TaskAssignment,
  TaskDeleted,
  TaskRestored,
  ToDoListDeleted,
  ToDoListsDeleted,
  TaskTitleUpdate,
  TaskDeadlineUpdate,
  TaskDescriptionUpdate,
  ProjectDeleted,
  PermissionsUpdated,
  TaskLabelsUpdate,
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
    maxWidth: 371,
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
  const descriptionRef = useRef();
  const elementOverflowed =
    descriptionRef.current &&
    descriptionRef.current.scrollWidth > descriptionRef.current.clientWidth;

  const description =
    (notification.type === ProjectInvitation && (
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
    )) ||
    (notification.type === TaskArchived && (
      <span>
        <strong>{notification.sender.username}</strong>
        {' archived task: '}
        <strong>{`"${notification.task.title}"`}</strong>
      </span>
    )) ||
    (notification.type === TaskDeleted && (
      <span>
        <strong>{notification.sender.username}</strong>
        {' deleted task: '}
        <strong>{`"${notification.description}"`}</strong>
      </span>
    )) ||
    (notification.type === TaskRestored && (
      <span>
        <strong>{notification.sender.username}</strong>
        {' restored task: '}
        <strong>{`"${notification.task.title}"`}</strong>
      </span>
    )) ||
    (notification.type === NewToDoList && (
      <span>
        <strong>{notification.sender.username}</strong>
        {' added new to-do list to task: '}
        <strong>{`"${notification.task.title}"`}</strong>
      </span>
    )) ||
    (notification.type === NewToDoLists && (
      <span>
        <strong>{notification.sender.username}</strong>
        {' added new to-do lists to task : '}
        <strong>{`"${notification.task.title}"`}</strong>
      </span>
    )) ||
    (notification.type === ToDoListDeleted && (
      <span>
        <strong>{notification.sender.username}</strong>
        {' deleted to-do list from task: '}
        <strong>{`"${notification.task.title}"`}</strong>
      </span>
    )) ||
    (notification.type === ToDoListsDeleted && (
      <span>
        <strong>{notification.sender.username}</strong>
        {' deleted to-do lists from task: '}
        <strong>{`"${notification.task.title}"`}</strong>
      </span>
    )) ||
    (notification.type === NewComment && (
      <span>
        <strong>{notification.sender.username}</strong>
        {' commented on task: '}
        <strong>{`"${notification.task.title}"`}</strong>
      </span>
    )) ||
    (notification.type === NewComments && (
      <span>
        There are new comments on task:
        <strong>{` "${notification.task.title}"`}</strong>
      </span>
    )) ||
    (notification.type === TaskTitleUpdate && (
      <span>
        <strong>{notification.sender.username}</strong>
        {' updated title in task: '}
        <strong>{`"${notification.task.title}"`}</strong>
      </span>
    )) ||
    (notification.type === TaskDeadlineUpdate && (
      <span>
        <strong>{notification.sender.username}</strong>
        {' updated deadline in task: '}
        <strong>{`"${notification.task.title}"`}</strong>
      </span>
    )) ||
    (notification.type === TaskDescriptionUpdate && (
      <span>
        <strong>{notification.sender.username}</strong>
        {' updated description in task: '}
        <strong>{`"${notification.task.title}"`}</strong>
      </span>
    )) ||
    (notification.type === TaskLabelsUpdate && (
      <span>
        <strong>{notification.sender.username}</strong>
        {' updated labels in task: '}
        <strong>{`"${notification.task.title}"`}</strong>
      </span>
    )) ||
    (notification.type === ProjectDeleted && (
      <span>
        <strong>{notification.sender.username}</strong>
        {' has just'}
        {notification.description.split(':')[0]}
        <strong>{notification.description.split(':')[1]}</strong>
      </span>
    )) ||
    (notification.type === PermissionsUpdated && (
      <span>
        <strong>{notification.sender.username}</strong>
        {notification.description === '1'
          ? ' took your administrator permissions in project:'
          : ' set your permissions to administrator in project:'}
        <strong>{` "${notification.project.title}"`}</strong>
      </span>
    ));
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
              src={notification.sender.profilePicture}
            />
          </Link>
          <div className={classes.notificationMessage}>
            <Typography
              variant='caption'
              className={classes.notificationCaption}
              style={{ textTransform: 'capitalize' }}
            >
              {notification.type}
            </Typography>
            <Tooltip title={elementOverflowed ? description : ''}>
              <Typography
                variant='body2'
                className={classes.notificationDescription}
                ref={descriptionRef}
              >
                {description}
              </Typography>
            </Tooltip>
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
          {![RemovedFromProject, ProjectDeleted, TaskDeleted].includes(
            notification.type
          ) && (
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
