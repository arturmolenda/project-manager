import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import AdministratorMenu from './userMenus/AdministratorMenu';
import NormalMenu from './userMenus/NormalMenu';
import UsersGroup from './UsersGroup';

const Users = () => {
  const {
    project: { users, permissions: userPermissions, _id: projectId, creatorId },
  } = useSelector((state) => state.projectGetData);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleUserClick = (anchor, user) => {
    setAnchorEl(anchor);
    setUser(user);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setUser(null);
  };

  return (
    <>
      <UsersGroup
        users={users}
        handleUserClick={handleUserClick}
        projectId={projectId}
        creatorId={creatorId}
        userPermissions={userPermissions}
      />

      {users && user !== null && userPermissions === 2 && (
        <AdministratorMenu
          anchorEl={anchorEl}
          handleClose={handleClose}
          user={user.user}
          permissions={user.permissions}
          projectOwner={user.user._id === creatorId}
          projectId={projectId}
        />
      )}
      {users && user !== null && userPermissions === 1 && (
        <NormalMenu
          anchorEl={anchorEl}
          handleClose={handleClose}
          user={user.user}
          permissions={user.permissions}
          projectId={projectId}
        />
      )}
    </>
  );
};

export default Users;
