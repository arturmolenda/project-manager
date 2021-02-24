import React from 'react';

import { makeStyles, Tooltip, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles(() => ({
  uploadIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
  },
}));

const ImageUpload = ({
  setFormData,
  setBackground,
  imageSelectRef,
  disabled,
}) => {
  const classes = useStyles();

  const handleSelectPicture = () => {
    imageSelectRef.current.click();
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    if (imageFile) {
      let fileType = imageFile.type.split('/');
      fileType = fileType[fileType.length - 1];
      if (!!fileType.match('jpg|jpeg|png|gif')) {
        const blob = imageFile.slice(0, imageFile.size, imageFile.type);
        const newFileName = uuidv4();
        const newFile = new File([blob], newFileName, {
          type: imageFile.type,
        });
        const imageDisplay = URL.createObjectURL(imageFile);
        setBackground(imageDisplay);
        const formData = new FormData();
        formData.append('img', newFile);
        setFormData(formData);
      }
    }
  };

  return (
    <Tooltip title='Upload' className={classes.uploadIcon}>
      <Fab
        color='primary'
        onClick={handleSelectPicture}
        size='small'
        disabled={disabled}
      >
        <input
          ref={imageSelectRef}
          id='imageUpload'
          type='file'
          hidden='hidden'
          onChange={handleImageChange}
        />
        <AddIcon />
      </Fab>
    </Tooltip>
  );
};

export default ImageUpload;
