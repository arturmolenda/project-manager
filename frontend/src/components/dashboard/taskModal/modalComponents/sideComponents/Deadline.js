import React from 'react';

import ScheduleIcon from '@material-ui/icons/Schedule';

import SideButton from './SideButton';

const Deadline = () => {
  return (
    <>
      <div>
        <SideButton icon={<ScheduleIcon />} text='Deadline' />
      </div>
    </>
  );
};

export default Deadline;
