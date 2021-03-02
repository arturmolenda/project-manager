import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { PROJECT_DATA_PERMISSIONS_UPDATE } from '../../../../redux/constants/projectConstants';

import UserMenu from './userMenus/UserMenu';
import UsersGroup from './UsersGroup';

const Users = ({ maxUsers }) => {
  const dispatch = useDispatch();
  const history = useHistory();
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
    socket.on('user-removed', ({ userUpdated }) => {
      if (userInfo._id === userUpdated.userId) {
        history.push('/boards');
      } else if (user && user.user._id === userUpdated.userId)
        setAnchorEl(null);
    });
    socket.on('project-deleted', () => {
      history.push('/boards');
    });
    return () => {
      socket.off('user-permissions-changed');
      socket.off('user-removed');
      socket.off('project-deleted');
    };
  }, [dispatch, history, socket, anchorEl, userInfo, user]);

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
        maxUsers={maxUsers}
      />
      {users && user !== null && (
        <UserMenu
          userPermissions={userPermissions}
          anchorEl={anchorEl}
          handleClose={handleClose}
          profilePicture={
            userInfo._id === user.user._id
              ? userInfo.profilePicture
              : user.user.profilePicture
          }
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
