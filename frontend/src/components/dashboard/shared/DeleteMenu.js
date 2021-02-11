import React from 'react';

import { Menu, Typography, Button } from '@material-ui/core';

import MenuHeader from './MenuHeader';

const DeleteMenu = ({
  Header,
  headerTitle,
  anchorEl,
  handleClose,
  deleteHandle,
  text,
  buttonText,
}) => {
  return Header ? (
    <div style={{ maxWidth: 270, outline: 'none' }}>
      {Header}
      <div style={{ padding: '5px 10px' }}>
        <Typography variant='subtitle2' style={{ padding: '5px 5px 0' }}>
          {text}
        </Typography>
        <Button
          style={{ marginTop: 10 }}
          fullWidth
          color='secondary'
          variant='contained'
          onClick={deleteHandle}
        >
          {buttonText ? buttonText : 'Delete'}
        </Button>
      </div>
    </div>
  ) : (
    <Menu
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
        horizontal: 'left',
      }}
      PaperProps={{
        style: { borderTopLeftRadius: 8, borderTopRightRadius: 8 },
      }}
      transitionDuration={0}
    >
      <div style={{ maxWidth: 270, outline: 'none' }}>
        <MenuHeader title={headerTitle} handleClose={handleClose} />
        <div style={{ padding: '5px 10px' }}>
          <Typography variant='subtitle2' style={{ padding: '5px 5px 0' }}>
            {text}
          </Typography>
          <Button
            style={{ marginTop: 10 }}
            fullWidth
            color='secondary'
            variant='contained'
            onClick={deleteHandle}
          >
            {buttonText ? buttonText : 'Delete'}
          </Button>
        </div>
      </div>
    </Menu>
  );
};

export default DeleteMenu;
