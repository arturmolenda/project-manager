import React, { useState, useEffect } from 'react';

import { makeStyles } from '@material-ui/core/styles';

import Typography from '@material-ui/core/Typography';
import ScheduleIcon from '@material-ui/icons/Schedule';

import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  primary: {
    color: theme.palette.primary.main,
    '&:hover': {
      background: 'none !important',
    },
  },
  secondary: {
    color: theme.palette.secondary.main,
    '&:hover': {
      background: 'none !important',
    },
  },
  date: {
    color: 'rgb(117, 117, 117)',
    marginLeft: 5,
  },
}));

const TaskDeadlineIcon = ({ deadline }) => {
  const [deadlineClose, setDeadlineClose] = useState(false);
  useEffect(() => {
    if (deadline !== null) {
      const now = moment(new Date());
      const date = moment(deadline);
      const diff = now.diff(date, 'hours');
      diff >= -23 ? setDeadlineClose(true) : setDeadlineClose(false);
    }
  }, [deadline]);

  const classes = useStyles();
  return (
    <div className={classes.container}>
      <ScheduleIcon
        className={deadlineClose ? classes.secondary : classes.primary}
        fontSize={'small'}
      />
      <Typography variant='caption' className={classes.date}>
        {new Date().getFullYear() === moment(deadline).year()
          ? moment(deadline).format('Do MMM')
          : moment(deadline).format('Do MMM YY')}
      </Typography>
    </div>
  );
};

export default TaskDeadlineIcon;
