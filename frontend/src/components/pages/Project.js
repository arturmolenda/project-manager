import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { getProjectData } from '../../redux/actions/projectActions';
import {
  PROJECT_SET_CURRENT,
  PROJECT_SET_CURRENT_RESET,
} from '../../redux/constants/projectConstants';
import Board from '../dashboard/Board';
import Loader from '../Loader';
const isObjectId = /^[0-9a-fA-F]{24}$/;

const Project = () => {
  const [projectLoading, setProjectLoading] = useState(false);
  const backgroundRef = useRef();
  const dispatch = useDispatch();
  const { project } = useSelector((state) => state.projectGetData);
  const { userInfo } = useSelector((state) => state.userLogin);
  const { id } = useParams();
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
      backgroundRef.current.style.backgroundImage = 'none';
      setProjectLoading(true);
      dispatch(getProjectData(id));
    } else {
      history.push('/boards');
    }
  }, [history, dispatch, id]);

  // Reset current project on component change
  useEffect(() => {
    return () => {
      dispatch({ type: PROJECT_SET_CURRENT_RESET });
    };
  }, [dispatch]);

  // Set main loading and check if project bg is a image
  useEffect(() => {
    if (project && id && project._id === id) {
      if (project.background.image) {
        const imageLoader = new Image();
        imageLoader.src = project.background.image;
        imageLoader.onload = () => {
          setProjectLoading(false);
          backgroundRef.current.style.backgroundImage = `url(${project.background.image})`;
          backgroundRef.current.style.backgroundSize = project.background.size;
          backgroundRef.current.style.backgroundPosition =
            project.background.position;
          backgroundRef.current.style.backgroundRepeat =
            project.background.repeat;
        };
        imageLoader.onerror = () => setProjectLoading(false);
      } else if (project.background.color) {
        backgroundRef.current.style.backgroundImage = project.background.color;
        setProjectLoading(false);
      }
    }
  }, [id, project]);

  return (
    <>
      <div
        id='project-background'
        ref={backgroundRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
        }}
      />
      {projectLoading ? <Loader /> : project && <Board />}
    </>
  );
};

export default Project;
