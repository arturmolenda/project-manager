import React, { useState } from 'react';

import FileCopyIcon from '@material-ui/icons/FileCopy';
import { Menu } from '@material-ui/core';

import TransferTasks from '../../../lists/listMore/TransferTasks';
import SideButton from './SideButton';
import { useDispatch } from 'react-redux';
import { copyTask } from '../../../../../redux/actions/projectActions';

const Copy = ({ task }) => {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const closeHandle = () => {
    loading && setLoading(false);
    setAnchorEl(null);
  };

  const transferHandle = (listIndex, listId, callback) => {
    setLoading(listId);
    dispatch(copyTask(task.projectId, task._id, listId, () => {
      closeHandle();
      setLoading(null);
    }));
  };

  return (
    <>
      <SideButton
        icon={<FileCopyIcon />}
        text='Copy'
        clickHandle={(e) => setAnchorEl(e.currentTarget)}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={closeHandle}
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
            transferHandle={transferHandle}
            handleClose={closeHandle}
            loading={loading}
            title={'Copy Task'}
          />
        </div>
      </Menu>
    </>
  );
};

export default Copy;
