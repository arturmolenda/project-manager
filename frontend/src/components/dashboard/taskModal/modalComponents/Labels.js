import React from 'react';

import { useSelector } from 'react-redux';

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

const Labels = ({ labels: taskLabels }) => {
  const {
    labels: { labels },
  } = useSelector((state) => state.projectGetData);
  const classes = useStyles();

  return (
    <>
      {taskLabels && taskLabels.length > 0 && (
        <div>
          <Typography className={classes.caption} variant='body1'>
            Labels
          </Typography>
          <div className={classes.container}>
            {taskLabels.map((labelId) => (
              <LabelItem key={labelId} label={labels[labelId]} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Labels;
