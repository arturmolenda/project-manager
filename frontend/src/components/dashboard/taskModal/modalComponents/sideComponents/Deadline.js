import React from 'react';

import { useDispatch } from 'react-redux';
import { taskFieldUpdate } from '../../../../../redux/actions/projectActions';

import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ScheduleIcon from '@material-ui/icons/Schedule';

import SideButton from './SideButton';

const Deadline = ({ task, disabled }) => {
  const dispatch = useDispatch();

  const openPickerHandle = () => document.getElementById('date-picker').click();

  const updateDeadline = (date) => {
    dispatch(taskFieldUpdate(task._id, task.projectId, date, 'deadline'));
  };

  return (
    <>
      <SideButton
        icon={<ScheduleIcon />}
        text='Deadline'
        clickHandle={openPickerHandle}
        disabled={disabled}
      />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <div style={{ display: 'none' }}>
          <DatePicker
            id='date-picker'
            clearable={Boolean(task.deadline)}
            label='Deadline'
            inputVariant='outlined'
            format='MM/dd/yyyy'
            value={task.deadline || new Date()}
            onChange={updateDeadline}
          />
        </div>
      </MuiPickersUtilsProvider>
    </>
  );
};

export default Deadline;
