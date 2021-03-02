import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';

import { Menu } from '@material-ui/core';
import AdminInnerMenu from './innerMenus/AdminInnerMenu';
import UsersGroupInnerMenu from './innerMenus/UsersGroupInnerMenu';
import NormalInnerMenu from './innerMenus/NormalInnerMenu';

const GroupMenu = ({
  anchorEl,
  handleClose,
  users,
  userPermissions,
  projectId,
  creatorId,
}) => {
  const { userInfo } = useSelector((state) => state.userLogin);
  const [administrators, setAdministrators] = useState([]);
  const [normalUsers, setNormalUsers] = useState([]);
  const [invitedUsers, setInvitedUsers] = useState([]);
  const [user, setUser] = useState(null);
  useEffect(() => {
    setAdministrators(users.filter((user) => user.permissions === 2));
    setNormalUsers(users.filter((user) => user.permissions === 1));
    setInvitedUsers(users.filter((user) => user.permissions === 0));
    setUser(null);
  }, [users]);

  const closeHandle = () => {
    handleClose();
    setTimeout(() => setUser(), 200);
  };

  const handleUserClick = (user) => {
    setUser(user);
  };

  const goBackHandle = () => {
    setUser(null);
  };

  return (
    <Menu
      disableScrollLock={true}
      anchorEl={anchorEl}
      keepMounted
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
    >
      <div style={{ outline: 'none' }}>
        {user ? (
          userPermissions === 2 ? (
            <AdminInnerMenu
              profilePicture={
                userInfo._id === user.user._id
                  ? userInfo.profilePicture
                  : user.user.profilePicture
              }
              user={user.user}
              permissions={user.permissions}
              projectOwner={user.user._id === creatorId}
              projectId={projectId}
              handleClose={closeHandle}
              goBackHandle={goBackHandle}
            />
          ) : (
            <NormalInnerMenu
              profilePicture={
                userInfo._id === user.user._id
                  ? userInfo.profilePicture
                  : user.user.profilePicture
              }
              user={user.user}
              permissions={user.permissions}
              projectId={projectId}
              handleClose={closeHandle}
              goBackHandle={goBackHandle}
            />
          )
        ) : (
          <UsersGroupInnerMenu
            administrators={administrators}
            normalUsers={normalUsers}
            invitedUsers={invitedUsers}
            handleClose={closeHandle}
            handleUserClick={handleUserClick}
          />
        )}
      </div>
    </Menu>
  );
};

export default GroupMenu;
