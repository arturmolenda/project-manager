import React, { useState } from 'react';

import FileCopyIcon from '@material-ui/icons/FileCopy';
import { Menu } from '@material-ui/core';

import TransferTasks from '../../../lists/listMore/TransferTasks';
import SideButton from './SideButton';

const Copy = ({ task }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const transferHandle = (listIndex) => {
    console.log('transfer');
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
          transferHandle={transferHandle}
          handleClose={() => setAnchorEl(null)}
          title={'Copy Task'}
        />
      </Menu>
    </>
  );
};

export default Copy;
