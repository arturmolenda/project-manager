import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { markNotificationsSeen } from '../../../../redux/actions/userActions';

import { IconButton, Badge } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';

import NotificationsMenu from './NotificationsMenu';

const Notifications = () => {
  const { notifications } = useSelector((state) => state.userLogin);
  const [anchorEl, setAnchorEl] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      notifications &&
      notifications.newNotificationsCount !== 0 &&
      anchorEl
    ) {
      dispatch(markNotificationsSeen());
    }
  }, [dispatch, notifications, anchorEl]);

  const openNotificationsHandle = (e) => {
    setAnchorEl(e.currentTarget);
    if (notifications && notifications.newNotificationsCount !== 0) {
      dispatch(markNotificationsSeen());
    }
  };

  return (
    <>
      <IconButton color='inherit' onClick={openNotificationsHandle}>
        <Badge
          badgeContent={notifications && notifications.newNotificationsCount}
          color='secondary'
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <NotificationsMenu
        anchorEl={anchorEl}
        handleClose={() => setAnchorEl(null)}
      />
    </>
  );
};

export default Notifications;
