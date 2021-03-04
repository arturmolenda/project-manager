import React, { useState } from 'react';

import PeopleIcon from '@material-ui/icons/People';
import SideButton from '../SideButton';
import AddUsersMenu from './AddUsersMenu';

const Users = ({ task, disabled }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  return (
    <>
      <SideButton
        icon={<PeopleIcon />}
        text='Users'
        clickHandle={(e) => setAnchorEl(e.currentTarget)}
        disabled={disabled}
      />
      <AddUsersMenu
        anchorEl={anchorEl}
        selectedUsers={task.users}
        projectId={task.projectId}
        taskId={task._id}
        handleClose={() => setAnchorEl(null)}
      />
    </>
  );
};

export default Users;
