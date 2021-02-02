import React from 'react';
import { useHistory } from 'react-router-dom';

import { makeStyles, Modal } from '@material-ui/core';

import TaskHeader from './modalComponents/TaskHeader';
import TaskDescription from './modalComponents/TaskDescription';
import SideContent from './modalComponents/SideContent';

const useStyles = makeStyles(() => ({
  container: {
    height: '90vh',
    maxWidth: 700,
    margin: '5vh auto',
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: '20px 10px 20px 20px',
    backgroundColor: '#f4f5f7',
  },
  innerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 10,
  },
}));

const TaskModal = ({ task, userPermissions }) => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <Modal
      disableEnforceFocus
      open={Boolean(task)}
      disableScrollLock
      onClose={() => history.push(`/project/${task.projectId}`)}
    >
      <div className={classes.container}>
        {task && (
          <>
            <TaskHeader task={task} initialDescription={task.description} />
            <div className={classes.innerContainer}>
              <div style={{ width: '100%' }}>
                <TaskDescription
                  userPermissions={userPermissions}
                  task={task}
                />
              </div>
              <SideContent task={task} />
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default TaskModal;
