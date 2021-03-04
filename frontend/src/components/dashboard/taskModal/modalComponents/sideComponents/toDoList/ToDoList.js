import React, { useState } from 'react';

import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';

import SideButton from '../SideButton';
import ToDoMenu from './ToDoMenu';

const ToDoList = ({ task, disabled }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  return (
    <>
      <SideButton
        icon={<PlaylistAddCheckIcon />}
        text='To-Do List'
        clickHandle={(e) => setAnchorEl(e.currentTarget)}
        disabled={disabled}
      />
      <ToDoMenu
        taskId={task._id}
        projectId={task.projectId}
        anchorEl={anchorEl}
        handleClose={() => setAnchorEl(null)}
      />
    </>
  );
};

export default ToDoList;
