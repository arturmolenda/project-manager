import React, { useState, useEffect, useRef } from 'react';

import { useDispatch } from 'react-redux';
import {
  findUsersToInvite,
  sendProjectInvitations,
} from '../../../../redux/actions/projectActions';

import {
  Button,
  Chip,
  makeStyles,
  Popover,
  TextField,
  Typography,
} from '@material-ui/core';
import SearchMenu from './SearchMenu';

import InviteLink from './InviteLink';
import Loader from '../../../Loader';

const useStyles = makeStyles((theme) => ({
  container: {
    width: 300,
    outline: 'none',
  },
  innerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 250,
    padding: '7px',
    overflowY: 'auto',
  },
  header: {
    backgroundColor: theme.palette.primary.main,
    padding: '2px 0',
    textAlign: 'center',
    borderBottom: 'none',
    color: '#fff',
    '& h6': { fontWeight: 700 },
  },

  usersContainer: {
    padding: '4px 4px 0',
    maxHeight: 80,
    overflow: 'auto',
    border: `2px solid ${theme.palette.primary.main}`,
    margin: 6,
    borderRadius: 4,
  },
  userChip: {
    margin: '0 4px 4px 0',
  },
}));

const AddUserModal = ({ anchorEl, handleClose }) => {
  const dispatch = useDispatch();
  const [searchOpen, setSearchOpen] = useState(false);
  const [error, setError] = useState();
  const [userData, setUserData] = useState('');
  const [usersToInvite, setUsersToInvite] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const classes = useStyles();

  const closeHandle = () => {
    setLoading(false);
    setUserData('');
    setUsersToInvite([]);
    setSearchOpen(false);
    handleClose();
  };

  // when user stops typing then open SearchMenu
  useEffect(() => {
    const timeout =
      userData.trim() !== '' &&
      setTimeout(() => {
        dispatch(findUsersToInvite(userData));
        setSearchOpen(true);
      }, 200);
    return () => clearTimeout(timeout);
  }, [dispatch, userData]);

  const changeHandle = (e) => {
    setUserData(e.target.value);
    setError(false);
    setSearchOpen(false);
  };

  //
  const userDeleteHandle = (index) => {
    setUsersToInvite((prevUsers) => {
      const newUsers = [...prevUsers];
      newUsers.splice(index, 1);
      return newUsers;
    });
  };

  // adds user clicked in SearchMenu.js
  const addUserHandle = (userToAdd) => {
    setSearchOpen(false);
    setUserData('');
    setUsersToInvite((prev) => [...prev, userToAdd]);
    inputRef.current.focus();
  };

  const inviteUsersHandle = () => {
    if (usersToInvite.length > 0) {
      setLoading(true);
      dispatch(sendProjectInvitations(usersToInvite, () => closeHandle()));
    }
  };

  return (
    <>
      <Popover
        disableScrollLock={true}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeHandle}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        PaperProps={{
          style: { borderTopLeftRadius: 8, borderTopRightRadius: 8 },
        }}
        transitionDuration={0}
      >
        <div className={classes.container}>
          <div className={classes.header}>
            <Typography variant='subtitle1'>Invite Users</Typography>
          </div>

          {usersToInvite.length > 0 && (
            <div className={classes.usersContainer}>
              {usersToInvite.map((user, index) => (
                <Chip
                  className={classes.userChip}
                  fullWidth
                  label={user.username}
                  onDelete={() => userDeleteHandle(index)}
                />
              ))}
            </div>
          )}
          <div className={classes.innerContainer}>
            <div>
              <TextField
                inputRef={inputRef}
                className={classes.textfield}
                name='user'
                type='text'
                label='User'
                variant='outlined'
                value={userData}
                style={{ marginBottom: 10 }}
                fullWidth
                onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                error={Boolean(error)}
                helperText={error}
                onChange={changeHandle}
                margin='dense'
                onClick={(e) => e.preventDefault()}
                inputProps={{
                  autoComplete: 'off',
                }}
              />
              <InviteLink />
            </div>
            <Button
              onClick={inviteUsersHandle}
              color='primary'
              variant='contained'
              fullWidth
              style={{ marginTop: 40 }}
              disabled={loading}
            >
              Invite
              {loading && <Loader button />}
            </Button>
          </div>
        </div>
        <SearchMenu
          anchorEl={inputRef.current}
          open={searchOpen}
          handleClose={() => setSearchOpen(false)}
          clickAction={addUserHandle}
          usersToInvite={usersToInvite}
        />
      </Popover>
    </>
  );
};

export default AddUserModal;
