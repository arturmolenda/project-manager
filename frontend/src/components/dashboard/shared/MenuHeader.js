import React from 'react';

import { Typography, Divider } from '@material-ui/core';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import CloseRoundedIcon from '@material-ui/icons/CloseRounded';

const MenuHeader = ({ goBackHandle, handleClose, title }) => {
  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: 4,
        }}
      >
        {goBackHandle ? (
          <ArrowBackIosIcon
            style={{
              fontSize: '1rem',
              cursor: 'pointer',
              marginLeft: 10,
            }}
            onClick={goBackHandle}
          />
        ) : (
          <CloseRoundedIcon
            style={{
              fontSize: '1.3rem',
              cursor: 'pointer',
              marginRight: 10,
              visibility: 'hidden',
            }}
          />
        )}
        <Typography
          variant='subtitle1'
          style={{
            overflowX: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            padding: '0 15px',
          }}
        >
          {title}
        </Typography>
        <CloseRoundedIcon
          style={{
            fontSize: '1.3rem',
            cursor: 'pointer',
            marginRight: 10,
            width: 21,
            height: 21,
          }}
          onClick={handleClose}
        />
      </div>
      <Divider style={{ margin: '0 9px' }} />
    </>
  );
};

export default MenuHeader;
