import React, { useEffect, useRef, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { setTask } from '../../../redux/actions/projectActions';
import { PROJECT_SET_TASK_RESET } from '../../../redux/constants/projectConstants';

import { LinearProgress, makeStyles, Modal } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import ModalContainer from './ModalContainer';
import Helmet from '../../Helmet';

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    overflow: 'auto',
    borderRadius: 5,
    height: '90vh',
    maxWidth: 700,
    margin: '5vh auto',
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#f4f5f7',
    [theme.breakpoints.down(720)]: {
      margin: '5vh 10px',
    },
  },
  innerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 10,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      height: '100%',
    },
  },
  closeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 3,
    cursor: 'pointer',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}));

const TaskModal = ({ projectId, userPermissions, userId }) => {
  const dispatch = useDispatch();
  const { task } = useSelector((state) => state.projectSetTask);
  const [loading, setLoading] = useState(true);
  const timeout = useRef();
  const history = useHistory();
  const { taskId } = useParams();
  const classes = useStyles();

  useEffect(() => {
    if (taskId && !task) dispatch(setTask(projectId, taskId));
    else if (!taskId && task) dispatch({ type: PROJECT_SET_TASK_RESET });
    else if (taskId && task)
      timeout.current = setTimeout(() => setLoading(false), 1);
  }, [dispatch, history, taskId, task, projectId]);

  const closeHandle = () => {
    history.push(`/project/${task.projectId}`);
    dispatch({ type: PROJECT_SET_TASK_RESET });
    setLoading(true);
    clearTimeout(timeout.current);
  };

  const keyPressHandle = (e) => {
    if (document.activeElement.id === 'task-modal' && e.key === 'Escape')
      closeHandle();
  };

  return (
    <Modal
      open={Boolean(task)}
      disableScrollLock
      onClose={closeHandle}
      onKeyDown={keyPressHandle}
    >
      <div className={classes.container} id='task-modal'>
        <Helmet title={task && task.title} />
        {task && task.deleted && <Redirect to={`/project/${task.projectId}`} />}
        {loading ? (
          <LinearProgress />
        ) : (
          <ModalContainer
            task={task}
            userPermissions={userPermissions}
            userId={userId}
          />
        )}
        <CloseIcon className={classes.closeIcon} onClick={closeHandle} />
      </div>
    </Modal>
  );
};

export default TaskModal;
