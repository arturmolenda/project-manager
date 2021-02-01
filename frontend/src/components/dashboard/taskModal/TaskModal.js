import React from 'react';
import { useHistory } from 'react-router-dom';

import { makeStyles, Modal } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  container: {
    maxWidth: 700,
    margin: '5vh auto',
    outline: 'none',
  },
  innerContainer: {
    height: '90vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '20px 10px 20px 20px',
    backgroundColor: '#f4f5f7',
  },
}));

const TaskModal = ({ task, projectId }) => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <Modal
      disableEnforceFocus
      open={Boolean(task)}
      disableScrollLock
      onClose={() => history.push(`/project/${projectId}`)}
    >
      <div className={classes.container}>
        <div className={classes.innerContainer}></div>
      </div>
    </Modal>
  );
};

export default TaskModal;
