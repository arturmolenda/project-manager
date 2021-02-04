import React from 'react';

import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';

import SideButton from './SideButton';

const ToDoList = () => {
  return (
    <>
      <SideButton icon={<PlaylistAddCheckIcon />} text='To Do List' />
    </>
  );
};

export default ToDoList;
