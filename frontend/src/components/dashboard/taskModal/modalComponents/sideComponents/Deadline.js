import React from 'react';

import ScheduleIcon from '@material-ui/icons/Schedule';

import SideButton from './SideButton';

const Deadline = () => {
  return (
    <>
      <SideButton icon={<ScheduleIcon />} text='Deadline' />
    </>
  );
};

export default Deadline;
