import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import LabelItem from '../../shared/LabelItem';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  caption: {
    margin: '5px 0',
    color: '#909090',
    fontSize: '.9rem',
    lineHeight: 1,
    fontWeight: 600,
  },
}));

const Labels = ({ labels }) => {
  const classes = useStyles();

  return (
    labels && (
      <div>
        <Typography className={classes.caption} variant='body1'>
          Labels
        </Typography>
        <div className={classes.container}>
          {labels.map((label) => (
            <LabelItem key={label._id} label={label} />
          ))}
        </div>
      </div>
    )
  );
};

export default Labels;
