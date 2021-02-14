import React from 'react';

const TasksProgress = ({ totalTasks, finishedTasks }) => {
  // calculate percentage of tasks finished
  const donePercentage =
    totalTasks === 0 ? 0 : Math.floor((finishedTasks * 100) / totalTasks);
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 5 }}>
      <div
        style={{
          minWidth: 25,
          maxWidht: 25,
          height: 'auto',
          display: 'flex',
          justifyContent: 'center',
          marginRight: 15,
        }}
      >
        <span
          style={{ fontSize: 11, color: '#696969', fontWeight: 600 }}
        >{`${donePercentage}%`}</span>
      </div>
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: 8,
          borderRadius: 50,
          backgroundColor: '#e6e6e6',
        }}
      >
        <div
          style={{
            width: `${donePercentage}%`,
            backgroundColor: donePercentage === 100 ? '#33cd31' : '#00bcd4',
            borderRadius: 50,
            transition: '.2s ease',
          }}
        />
      </div>
    </div>
  );
};

export default TasksProgress;
