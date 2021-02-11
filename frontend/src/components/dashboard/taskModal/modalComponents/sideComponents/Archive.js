import React, { useState } from 'react';

import DeleteIcon from '@material-ui/icons/Delete';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import SideButton from './SideButton';
import DeleteMenu from '../../../shared/DeleteMenu';

const Archive = ({ task }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const archiveHandle = () => {
    console.log('archive');
  };
  const deleteTaskHandle = () => {
    console.log('delete');
  };

  return (
    <>
      {task.archived ? (
        <SideButton
          icon={<HighlightOffIcon />}
          text={'Delete'}
          secondary
          clickHandle={(e) => setAnchorEl(e.currentTarget)}
        />
      ) : (
        <SideButton
          icon={<DeleteIcon />}
          text={'Archive'}
          clickHandle={archiveHandle}
        />
      )}
      <DeleteMenu
        anchorEl={anchorEl}
        handleClose={() => setAnchorEl(null)}
        headerTitle='Delete task?'
        deleteHandle={deleteTaskHandle}
        text={'Deleting a task cannot be undone, are you sure?'}
      />
    </>
  );
};

export default Archive;
