import React, { useState } from 'react';

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import { Menu } from '@material-ui/core';

import SideButton from './SideButton';
import TransferTasks from '../../../lists/listMore/TransferTasks';

const Transfer = ({ task, currentListId }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const transferHandle = (listIndex) => {
    if (task.archived) {
      console.log('transfer');
    } else {
      console.log('transfer');
    }
  };
  return (
    <>
      <SideButton
        icon={
          task.archived ? <SettingsBackupRestoreIcon /> : <ArrowForwardIcon />
        }
        text={task.archived ? 'Restore' : 'Transfer'}
        clickHandle={(e) => setAnchorEl(e.currentTarget)}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transitionDuration={0}
      >
        <TransferTasks
          listId={!task.archived && currentListId}
          transferHandle={transferHandle}
          handleClose={() => setAnchorEl(null)}
          title={task.archived ? 'Restore task' : 'Transfer task to other list'}
        />
      </Menu>
    </>
  );
};

export default Transfer;
