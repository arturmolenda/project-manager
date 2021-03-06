import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { updateProfilePicture } from '../../../redux/actions/userActions';

import {
  Avatar,
  CircularProgress,
  IconButton,
  makeStyles,
  Modal,
  Typography,
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '50%',
    outline: 'none',
    margin: 'calc(40vh - 225px) auto 0 auto',
  },
  avatar: {
    width: 450,
    height: 450,
    boxShadow:
      '0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%)',
    [theme.breakpoints.down('xs')]: {
      width: '90vw',
      height: '90vw',
    },
  },
  uploadIcon: {
    position: 'absolute',
    right: 30,
    bottom: -25,
    zIndex: 1111,
    '& svg': {
      width: 90,
      height: 90,
    },
    '& .Mui-disabled': {
      color: '#54aab5',
    },
  },
  imageDisabled: {
    backgroundColor: 'rgb(255 255 255 / 40%)',
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    borderRadius: '50%',
    zIndex: 111,
  },
  loader: {
    width: '70px !important',
    height: '70px !important',
    position: 'absolute',
    top: 'calc(50% - 35px)',
    left: 'calc(50% - 35px)',
  },
  close: {
    position: 'absolute',
    top: 2,
    right: 2,
    color: '#fff',
  },
  description: {
    fontSize: '1rem',
    textAlign: 'center',
    marginTop: 10,
  },
}));

const UserModal = ({ open, closeHandle, user }) => {
  const [info, setInfo] = useState('');
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.userPictureUpdate);
  const classes = useStyles();

  const handleSelectPicture = () => {
    const fileInput = document.getElementById('imageInput');
    fileInput.click();
  };

  const handleImageChange = (event) => {
    setInfo('');
    const imageFile = event.target.files[0];
    if (imageFile) {
      let fileType = imageFile.type.split('/');
      fileType = fileType[fileType.length - 1];
      // check if is image
      if (!!fileType.match('jpg|jpeg|png|gif')) {
        const blob = imageFile.slice(0, imageFile.size, imageFile.type);
        const newFile = new File([blob], user._id, {
          type: imageFile.type,
        });
        const formData = new FormData();
        formData.append('img', newFile);
        dispatch(updateProfilePicture(formData));
      } else setInfo('Wrong file type, accepts only jpg|jpeg|png|gif');
    }
  };
  return (
    <Modal open={open} onClose={closeHandle}>
      <div className={classes.container}>
        <div style={{ position: 'relative' }}>
          <Avatar
            src={user.profilePicture}
            alt={user.username}
            className={classes.avatar}
          />
          <div className={classes.uploadIcon}>
            <IconButton
              color='primary'
              disabled={loading}
              onClick={handleSelectPicture}
            >
              <input
                id='imageInput'
                type='file'
                hidden='hidden'
                onChange={handleImageChange}
              />
              <CloudUploadIcon />
            </IconButton>
          </div>
          {loading && (
            <>
              <div className={classes.imageDisabled} />
              <CircularProgress className={classes.loader} />
            </>
          )}
        </div>

        <div className={classes.description}>
          <Typography variant='subtitle2' style={{ color: '#fff' }}>
            {user.username}
          </Typography>
          <Typography variant='subtitle2' style={{ color: '#00e2ff' }}>
            {user.email}
          </Typography>
          {error && (
            <Alert severity='error'>
              Something went wrong, try again later!
            </Alert>
          )}
          {info && <Alert severity='info'>{info}</Alert>}
        </div>
        <IconButton className={classes.close} onClick={closeHandle}>
          <CloseIcon />
        </IconButton>
      </div>
    </Modal>
  );
};

export default UserModal;
