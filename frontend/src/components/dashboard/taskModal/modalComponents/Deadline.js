import React, { useState, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { taskFieldUpdate } from '../../../../redux/actions/projectActions';

import { makeStyles } from '@material-ui/core/styles';
import ScheduleIcon from '@material-ui/icons/Schedule';

import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

import Loader from '../../../Loader';

import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  header: {
    marginTop: 20,
    display: 'flex',
    alignItems: 'center',
    '& > svg': {
      marginRight: 15,
    },
  },
  datePicker: (props) => ({
    position: 'relative',
    width: 110,
    '& input': {
      cursor: !props.disabled && 'pointer',
    },
  }),
  primary: {
    '& .MuiInputLabel-formControl': {
      color: theme.palette.primary.main,
    },
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderWidth: 2,
      borderColor: theme.palette.primary.main,
    },
  },
  secondary: {
    '& .MuiInputLabel-formControl': {
      color: theme.palette.secondary.main,
    },
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderWidth: 2,
      borderColor: theme.palette.secondary.main,
    },
  },
  pickerDisabled: {
    '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
      borderWidth: 2,
      borderColor: '#ccc',
    },
  },
}));

const Deadline = ({ task, disabled }) => {
  const dispatch = useDispatch();
  const [deadlineClose, setDeadlineClose] = useState(false);
  const [loading, setLoading] = useState(false);
  const classes = useStyles({ disabled });

  useEffect(() => {
    if (task.deadline !== null) {
      const now = moment(new Date());
      const date = moment(task.deadline);
      const diff = now.diff(date, 'hours');
      diff >= -23 ? setDeadlineClose(true) : setDeadlineClose(false);
    }
  }, [task.deadline]);

  const deadlineHandle = (date) => {
    if (date !== null) {
      const diff = moment(new Date()).diff(moment(date), 'hours');
      // show red color if deadline is close
      diff >= -23 ? setDeadlineClose(true) : setDeadlineClose(false);
    }
    setLoading(true);
    dispatch(
      taskFieldUpdate(task._id, task.projectId, date, 'deadline', () =>
        setLoading(false)
      )
    );
  };

  return (
    task.deadline && (
      <div className={classes.header}>
        <ScheduleIcon color='primary' />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <div className={classes.datePicker}>
            <DatePicker
              clearable
              disabled={loading || disabled}
              className={
                loading
                  ? classes.pickerDisabled
                  : deadlineClose
                  ? classes.secondary
                  : classes.primary
              }
              label='Deadline'
              inputVariant='outlined'
              format='MM/dd/yyyy'
              value={task.deadline}
              onChange={deadlineHandle}
            />
            {loading && <Loader button />}
          </div>
        </MuiPickersUtilsProvider>
      </div>
    )
  );
};

export default Deadline;
