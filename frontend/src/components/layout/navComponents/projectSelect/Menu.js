import React from 'react';
import Typography from '@material-ui/core/Typography';
import Menu from '@material-ui/core/Menu';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';

const SelectMenu = ({ anchorEl, setAnchorEl, projects, currentProject }) => {
  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <div style={{ maxHeight: 300, width: 209, outline: 'none' }}>
        {projects ? (
          // ADD working menu
          <div />
        ) : (
          <div
            style={{
              height: 250,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <EmojiObjectsIcon
              style={{ height: 56, width: 56, color: '#979a9a' }}
            />
            <Typography variant='h5' style={{ color: '#979a9a' }}>
              So empty...
            </Typography>
          </div>
        )}
      </div>
    </Menu>
  );
};

export default SelectMenu;
