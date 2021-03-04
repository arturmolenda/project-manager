import React, { useState } from 'react';
import SideButton from '../SideButton';
import LabelIcon from '@material-ui/icons/Label';
import LabelMenu from './LabelMenu';

const Label = ({ task, disabled, listIndex, taskIndex }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  return (
    <>
      <SideButton
        icon={<LabelIcon />}
        text='Label'
        clickHandle={(e) => setAnchorEl(e.currentTarget)}
        disabled={disabled}
      />
      <LabelMenu
        task={task}
        listIndex={listIndex}
        taskIndex={taskIndex}
        anchorEl={anchorEl}
        handleClose={() => setAnchorEl(null)}
      />
    </>
  );
};

export default Label;
