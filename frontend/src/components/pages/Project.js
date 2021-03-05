import React, { useEffect, useRef, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { getProjectData } from '../../redux/actions/projectActions';
import {
  PROJECT_DATA_RESET,
  PROJECT_SET_CURRENT,
  PROJECT_SET_CURRENT_RESET,
} from '../../redux/constants/projectConstants';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';

import Board from '../dashboard/Board';
import Loader from '../Loader';
import TaskModal from '../dashboard/taskModal/TaskModal';
import Helmet from '../Helmet';

const isObjectId = /^[0-9a-fA-F]{24}$/;

const Project = () => {
  const [projectLoading, setProjectLoading] = useState(true);
  const [background, setBackground] = useState(false);
  const backgroundRef = useRef();
  const dispatch = useDispatch();
  const { loading, project, error } = useSelector(
    (state) => state.projectGetData
  );
  const { userInfo } = useSelector((state) => state.userLogin);
  const { socket } = useSelector((state) => state.socketConnection);
  const { id } = useParams();
  const history = useHistory();

  const mainColor =
    (userInfo.projectsThemes[id] && userInfo.projectsThemes[id].mainColor) ||
    '#00bcd4';
  const theme = createMuiTheme({
    palette: {
      primary: {
        main: mainColor,
      },
      secondary: {
        main: '#ff3d00',
      },
    },
  });

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
      dispatch({ type: PROJECT_DATA_RESET });
      setProjectLoading(true);
      socket.emit('disconnect-board', { room: id });
      document.removeEventListener('touchend', cleanClasses, false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, socket]);

  // Set main loading and check if project bg is a image
  useEffect(() => {
    if (project && project._id === id) {
      const projectBackground = userInfo.projectsThemes[id].background;
      if (projectBackground && projectBackground.startsWith('linear')) {
        setBackground(projectBackground);
        setProjectLoading(false);
      } else if (projectBackground && !projectBackground.startsWith('linear')) {
        const imageLoader = new Image();
        imageLoader.src = projectBackground;
        imageLoader.onload = () => {
          setProjectLoading(false);
          setBackground(`url(${projectBackground})`);
        };
        imageLoader.onerror = () => setProjectLoading(false);
      }
    } else if (error) setProjectLoading(false);
  }, [id, project, userInfo, error]);

  return (
    <MuiThemeProvider theme={theme}>
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
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundImage: !loading && !projectLoading && background,
        }}
      />
      {Boolean(projectLoading || loading) ? (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
          <Loader />
        </div>
      ) : error ? (
        <Redirect to='/boards' />
      ) : (
        project && (
          <>
            <Helmet title={project.title} />
            <Board />
            <TaskModal
              userPermissions={project.permissions}
              projectId={project._id}
              userId={userInfo._id}
            />
          </>
        )
      )}
    </MuiThemeProvider>
  );
};

export default Project;
