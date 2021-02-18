import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import { projectTaskTransfer } from '../../../../../redux/actions/projectActions';

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import SettingsBackupRestoreIcon from '@material-ui/icons/SettingsBackupRestore';
import { Menu } from '@material-ui/core';

import SideButton from './SideButton';
import TransferTasks from '../../../lists/listMore/TransferTasks';

const Transfer = ({ task, listIndex, taskIndex, currentListId }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);

  const transferHandle = (newListIndex, newListId, callback) => {
    if (task.archived) {
      dispatch(
        projectTaskTransfer(
          task._id,
          taskIndex,
          null,
          newListIndex,
          null,
          newListId,
          callback
        )
      );
    } else {
      dispatch(
        projectTaskTransfer(
          task._id,
          taskIndex,
          listIndex,
          newListIndex,
          currentListId,
          newListId,
          callback
        )
      );
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
        getContentAnchorEl={null}
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
        <div style={{ outline: 'none' }}>
          <TransferTasks
            listId={!task.archived && currentListId}
            transferHandle={transferHandle}
            handleClose={() => setAnchorEl(null)}
            title={
              task.archived ? 'Restore task' : 'Transfer task to other list'
            }
          />
        </div>
      </Menu>
    </>
  );
};

export default Transfer;
