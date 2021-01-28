import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import UsersGroup from './UsersGroup';

const Users = () => {
  const {
    project: { users, permissions, _id: projectId },
  } = useSelector((state) => state.projectGetData);
  const [userIndex, setUserIndex] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (anchor, index) => {
    setAnchorEl(anchor);
    setUserIndex(index);
  };

  return (
    <UsersGroup
      users={users}
      handleClick={handleClick}
      projectId={projectId}
      userPermissions={permissions}
    />
  );
};

export default Users;
