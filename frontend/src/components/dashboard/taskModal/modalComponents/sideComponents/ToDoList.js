import React from 'react';

import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';

import SideButton from './SideButton';

const ToDoList = () => {
  return (
    <>
      <div>
        <SideButton icon={<PlaylistAddCheckIcon />} text='To Do List' />
      </div>
    </>
  );
};

export default ToDoList;
