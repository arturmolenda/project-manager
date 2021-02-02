import React, { useState } from 'react';

import DeleteIcon from '@material-ui/icons/Delete';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import SideButton from './SideButton';
import DeleteItemMenu from '../../../shared/DeleteMenu';

const Archive = ({ task }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const archiveHandle = () => {
    console.log('archive');
  };
  const deleteTaskHandle = () => {
    console.log('delete');
  };

  return (
    <div>
      <div
        onClick={
          task.archived
            ? (e) => {
                setAnchorEl(e.currentTarget);
              }
            : archiveHandle
        }
      >
        {task.archived ? (
          <SideButton icon={<HighlightOffIcon />} text={'Delete'} secondary />
        ) : (
          <SideButton icon={<DeleteIcon />} text={'Archive'} />
        )}
      </div>
      <DeleteItemMenu
        anchorEl={anchorEl}
        handleClose={() => setAnchorEl(null)}
        headerTitle='Delete task?'
        deleteHandle={deleteTaskHandle}
        text={'Deleting a task cannot be undone, are you sure?'}
      />
    </div>
  );
};

export default Archive;
