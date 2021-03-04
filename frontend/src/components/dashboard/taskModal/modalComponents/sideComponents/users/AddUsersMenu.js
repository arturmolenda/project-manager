import React, { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { taskUsersUpdate } from '../../../../../../redux/actions/projectActions';

import { makeStyles, Menu, Button } from '@material-ui/core';

import Loader from '../../../../../Loader';
import MenuHeader from '../../../../shared/MenuHeader';
import UserItem from './UserItem';

import deepcopy from 'deepcopy';

const useStyles = makeStyles(() => ({
  usersContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '10px 5px 5px 10px',
    marginRight: 5,
    width: 270,
    maxHeight: 250,
    overflowY: 'auto',
  },
  chip: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
}));

const AddUsersMenu = ({
  anchorEl,
  handleClose,
  selectedUsers: selected = [],
  projectId,
  taskId,
  disabled,
}) => {
  const dispatch = useDispatch();
  const {
    project: { users: allUsers },
  } = useSelector((state) => state.projectGetData);
  const { userInfo } = useSelector((state) => state.userLogin);
  const [users, setUsers] = useState();
  const [loading, setLoading] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    // set users available for task assignment
    if (allUsers) {
      const allUsersCopy = deepcopy(allUsers);
      // check if user is already assigned or is invited and didn't join project
      const usersAvailable = allUsersCopy.reduce((acc, user) => {
        const userAvailable = !Boolean(
          selected.find((u) => u._id === user.user._id) ||
            user.permissions === 0
        );
        if (userAvailable) acc.push(user.user);
        return acc;
      }, []);

      const fixedSelectedUsers = selected.map((user) => {
        user.selected = true;
        return user;
      });

      setUsers([...fixedSelectedUsers, ...usersAvailable]);
    }
  }, [anchorEl, selected, allUsers]);

  const unselectClick = (index) => {
    setUsers((prevUsers) => {
      prevUsers[index].selected = false;
      return [...prevUsers];
    });
  };

  const selectClick = (index) => {
    setUsers((prevUsers) => {
      prevUsers[index].selected = true;
      return [...prevUsers];
    });
  };

  const saveUsers = () => {
    setLoading(true);
    const newUsersArray = users.reduce((acc, user) => {
      if (user.selected) acc.push(user._id);
      return acc;
    }, []);

    const removedUsers = selected
      .filter((u) => !newUsersArray.includes(u._id))
      .map((u) => u._id);
    const addedUsers = newUsersArray.filter(
      (userId) => !selected.find((u) => u._id === userId)
    );
    if (removedUsers.length === 0 && addedUsers.length === 0) {
      setLoading(false);
      handleClose();
    } else
      dispatch(
        taskUsersUpdate(
          taskId,
          projectId,
          newUsersArray,
          removedUsers,
          addedUsers,
          () => {
            setLoading(false);
            handleClose();
          }
        )
      );
  };

  return (
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
        horizontal: 'left',
      }}
      transitionDuration={0}
    >
      <div style={{ outline: 'none' }}>
        <MenuHeader title='Users' handleClose={handleClose} />
        <div className={classes.usersContainer}>
          {users &&
            users.map((user, i) => {
              if (user.selected)
                return (
                  <UserItem
                    key={i}
                    selected={true}
                    profilePicture={
                      userInfo._id === user._id
                        ? userInfo.profilePicture
                        : user.profilePicture
                    }
                    username={user.username}
                    clickHandle={() => unselectClick(i)}
                  />
                );
              else
                return (
                  <UserItem
                    key={i}
                    selected={false}
                    profilePicture={
                      userInfo._id === user._id
                        ? userInfo.profilePicture
                        : user.profilePicture
                    }
                    username={user.username}
                    clickHandle={() => selectClick(i)}
                  />
                );
            })}
        </div>

        <div style={{ paddingTop: 5 }}>
          <Button
            color='secondary'
            onClick={handleClose}
            style={{ margin: '0 5px 0 10px' }}
            size='small'
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            color='primary'
            variant='contained'
            onClick={saveUsers}
            size='small'
            disabled={loading || disabled}
          >
            Save
            {loading && <Loader button />}
          </Button>
        </div>
      </div>
    </Menu>
  );
};

export default AddUsersMenu;
