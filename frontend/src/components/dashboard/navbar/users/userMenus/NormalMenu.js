import React from 'react';

import Menu from '@material-ui/core/Menu';

import NormalInnerMenu from './innerMenus/NormalInnerMenu';

const NormalMenu = ({
  anchorEl,
  handleClose,
  user,
  permissions,
  projectId,
}) => (
  <Menu
    anchorEl={anchorEl}
    keepMounted
    open={Boolean(anchorEl)}
    onClose={handleClose}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'left',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'top',
    }}
  >
    <NormalInnerMenu
      handleClose={handleClose}
      user={user}
      permissions={permissions}
      projectId={projectId}
    />
  </Menu>
);

export default NormalMenu;
