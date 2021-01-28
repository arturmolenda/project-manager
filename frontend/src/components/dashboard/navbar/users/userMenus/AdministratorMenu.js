import React from 'react';

import Menu from '@material-ui/core/Menu';

import AdminInnerMenu from './innerMenus/AdminInnerMenu';

const AdministratorMenu = ({
  anchorEl,
  handleClose,
  user,
  permissions,
  projectOwner,
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
    <AdminInnerMenu
      user={user}
      permissions={permissions}
      projectOwner={projectOwner}
      projectId={projectId}
      handleClose={handleClose}
    />
  </Menu>
);

export default AdministratorMenu;
