import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { PROJECT_DATA_PERMISSIONS_UPDATE } from '../../../../redux/constants/projectConstants';

import UserMenu from './userMenus/UserMenu';
import UsersGroup from './UsersGroup';

const Users = () => {
  const dispatch = useDispatch();
  const {
    project: { users, permissions: userPermissions, _id: projectId, creatorId },
  } = useSelector((state) => state.projectGetData);
  const { userInfo } = useSelector((state) => state.userLogin);
  const { socket } = useSelector((state) => state.socketConnection);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    // fix issues with menu being opened while permissions are changed
    socket.on('user-permissions-changed', ({ userUpdated }) => {
      if (
        userInfo._id === userUpdated.userId ||
        (user && user.user._id === userUpdated.userId)
      ) {
        setAnchorEl(null);
      }
      if (userInfo._id === userUpdated.userId) {
        socket.emit('join-board', { room: userUpdated.projectId });
        dispatch({
          type: PROJECT_DATA_PERMISSIONS_UPDATE,
          payload: userUpdated.newPermissions,
        });
      }
    });
    return () => {
      socket.off('user-permissions-changed');
    };
  }, [dispatch, socket, anchorEl, userInfo, user]);

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
      {users && user !== null && (
        <UserMenu
          userPermissions={userPermissions}
          anchorEl={anchorEl}
          handleClose={handleClose}
          user={user.user}
          permissions={user.permissions}
          projectOwner={user.user._id === creatorId}
          projectId={projectId}
        />
      )}
    </>
  );
};

export default Users;
