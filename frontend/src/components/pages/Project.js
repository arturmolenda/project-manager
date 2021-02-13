import React, { useEffect, useRef, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { getProjectData, setTask } from '../../redux/actions/projectActions';
import {
  PROJECT_SET_CURRENT,
  PROJECT_SET_CURRENT_RESET,
  PROJECT_SET_TASK_RESET,
} from '../../redux/constants/projectConstants';

import Board from '../dashboard/Board';
import Loader from '../Loader';
import TaskModal from '../dashboard/taskModal/TaskModal';

const isObjectId = /^[0-9a-fA-F]{24}$/;

const Project = () => {
  const [projectLoading, setProjectLoading] = useState(false);
  const [background, setBackground] = useState(false);
  const backgroundRef = useRef();
  const dispatch = useDispatch();
  const { loading, project, error } = useSelector(
    (state) => state.projectGetData
  );
  const { userInfo } = useSelector((state) => state.userLogin);
  const { socket } = useSelector((state) => state.socketConnection);
  const { task } = useSelector((state) => state.projectSetTask);
  const { id, taskId } = useParams();
  const history = useHistory();

  // Set currentProject on initial mount
  useEffect(() => {
    if (id && userInfo && Object.keys(userInfo).length > 1) {
      let initiallyLoadedProject = userInfo.projectsJoined.find(
        (x) => x._id === id
      );
      if (!initiallyLoadedProject)
        initiallyLoadedProject = userInfo.projectsCreated.find(
          (x) => x._id === id
        );
      if (initiallyLoadedProject) {
        dispatch({
          type: PROJECT_SET_CURRENT,
          payload: initiallyLoadedProject,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Fetch project data or navigate to boards if link is broken
  useEffect(() => {
    if (id.match(isObjectId)) {
      setBackground('none');
      setProjectLoading(true);
      dispatch(getProjectData(id, project && project._id));
    } else {
      history.push('/boards');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history, dispatch, id]);

  // Reset current project on component change and fix react-smooth-dnd drag bug
  useEffect(() => {
    const cleanClasses = () => (document.body.className = '');
    document.addEventListener('touchend', cleanClasses, false);
    return () => {
      dispatch({ type: PROJECT_SET_CURRENT_RESET });
      setProjectLoading(true);
      socket.emit('disconnect-board', { room: id });
      document.removeEventListener('touchend', cleanClasses, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, socket]);

  // Set main loading and check if project bg is a image
  useEffect(() => {
    if (project && id && project._id === id) {
      if (project.background.image) {
        const imageLoader = new Image();
        imageLoader.src = project.background.image;
        imageLoader.onload = () => {
          setProjectLoading(false);
          setBackground(`url(${project.background.image})`);
          backgroundRef.current.style.backgroundSize = project.background.size;
          backgroundRef.current.style.backgroundPosition =
            project.background.position;
          backgroundRef.current.style.backgroundRepeat =
            project.background.repeat;
        };
        imageLoader.onerror = () => setProjectLoading(false);
      } else if (project.background.color) {
        setBackground(project.background.color);
        setProjectLoading(false);
      }
    } else if (error) setProjectLoading(false);
  }, [id, project, error]);

  // Get or reset task used in modal
  useEffect(() => {
    if (id && taskId && !task) dispatch(setTask(id, taskId));
    else if (!taskId && task) dispatch({ type: PROJECT_SET_TASK_RESET });
  }, [dispatch, id, taskId, task]);

  return (
    <>
      <div
        id='project-background'
        ref={backgroundRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          backgroundImage: !loading && !projectLoading && background,
        }}
      />
      {projectLoading || loading ? (
        <Loader />
      ) : error ? (
        <Redirect to='/boards' />
      ) : (
        project && (
          <>
            <Board taskId={taskId} />
            <TaskModal
              task={task}
              userPermissions={project.permissions}
              userId={userInfo._id}
            />
          </>
        )
      )}
    </>
  );
};

export default Project;
