import React from 'react';

import Menu from '@material-ui/core/Menu';

import AdminInnerMenu from './innerMenus/AdminInnerMenu';
import NormalInnerMenu from './innerMenus/NormalInnerMenu';

const UserMenu = ({
  anchorEl,
  handleClose,
  userPermissions,
  user,
  permissions,
  projectOwner,
  projectId,
}) => (
  <Menu
    anchorEl={anchorEl}
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
    {userPermissions === 2 && (
      <AdminInnerMenu
        user={user}
        permissions={permissions}
        projectOwner={projectOwner}
        projectId={projectId}
        handleClose={handleClose}
      />
    )}
    {userPermissions === 1 && (
      <NormalInnerMenu
        handleClose={handleClose}
        user={user}
        permissions={permissions}
        projectId={projectId}
      />
    )}
  </Menu>
);

export default UserMenu;
