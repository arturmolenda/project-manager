import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import NotificationsIcon from '@material-ui/icons/Notifications';

const Notifications = () => {
  return (
    <IconButton color='inherit'>
      <Badge badgeContent={0} color='secondary'>
        <NotificationsIcon />
      </Badge>
    </IconButton>
  );
};

export default Notifications;
