import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import { IconButton, Badge } from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';

import NotificationsMenu from './NotificationsMenu';

const Notifications = () => {
  const { notifications } = useSelector((state) => state.userLogin);
  const [anchorEl, setAnchorEl] = useState();

  return (
    <>
      <IconButton color='inherit' onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge
          badgeContent={notifications.newNotificationsCount}
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
