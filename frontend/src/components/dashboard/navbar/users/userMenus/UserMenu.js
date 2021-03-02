import React from 'react';

import Menu from '@material-ui/core/Menu';

import AdminInnerMenu from './innerMenus/AdminInnerMenu';
import NormalInnerMenu from './innerMenus/NormalInnerMenu';

const UserMenu = ({
  anchorEl,
  handleClose,
  userPermissions,
  profilePicture,
  user,
  permissions,
  projectOwner,
  projectId,
}) => (
  <Menu
    disableScrollLock={true}
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
        profilePicture={profilePicture}
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
        profilePicture={profilePicture}
        permissions={permissions}
        projectId={projectId}
      />
    )}
  </Menu>
);

export default UserMenu;
