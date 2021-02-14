import React from 'react';

import { Typography } from '@material-ui/core';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const TaskTasksCompleted = ({ total, completed }) => {
  const taskCompleted = completed === total;
  return (
    <div
      style={{
        display: 'flex',
        borderRadius: 2,
        padding: 2,
        backgroundColor: taskCompleted && '#2cb908',
      }}
    >
      <CheckCircleOutlineIcon
        fontSize={'small'}
        style={{ color: taskCompleted ? '#fff' : '#6d6d6d' }}
      />
      <Typography
        style={{
          color: taskCompleted ? '#fff' : 'rgb(117, 117, 117)',
          margin: '1px 0 0 4px',
        }}
        variant='caption'
      >{`${completed}/${total}`}</Typography>
    </div>
  );
};

export default TaskTasksCompleted;
