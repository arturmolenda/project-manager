import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  labelItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    minWidth: 32,
    minHeight: 8,
    fontWeight: 600,
    padding: '2px 10px',
    margin: 2,
    '&:first-child': {
      marginLeft: 0,
    },
    '& h6': {
      fontWeight: 600,
      overflowX: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'break-spaces',
    },
  },
}));
const LabelItem = ({ label, small }) => {
  const classes = useStyles();
  return (
    <>
      {label && (
        <div
          className={classes.labelItem}
          style={{
            backgroundColor: label.color,
            color: label.color === '#FFF' ? '#000' : '#fff',
            minWidth: small && 50,
            borderRadius: small && 5,
            justifyContent: small && 'flex-start',
            minHeight: small ? 8 : 25,
          }}
        >
          <Typography
            variant='subtitle2'
            style={{ fontSize: small && '0.7rem', lineHeight: small && 1.2 }}
          >
            {label.title}
          </Typography>
        </div>
      )}
    </>
  );
};

export default LabelItem;
