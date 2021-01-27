import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Loader from '../Loader';

const ProjectJoinPage = () => {
  const { socket } = useSelector((state) => state.socketConnection);
  const { userInfo } = useSelector((state) => state.userLogin);
  const { projectId, joinId } = useParams();
  const history = useHistory();
  useEffect(() => {
    if (projectId && joinId && userInfo) {
      let projectJoined = userInfo.projectsJoined.findIndex(
        (x) => x._id === projectId
      );
      if (projectJoined === -1) {
        projectJoined = userInfo.projectsCreated.findIndex(
          (x) => x._id === projectId
        );
      }
      if (projectJoined !== -1) history.push(`/project/${projectId}`);
      else {
        socket.emit('project-join', { projectId, joinId }, () =>
          history.push(`/project/${projectId}`)
        );
      }
    }
  }, [socket, history, userInfo, projectId, joinId]);
  return <Loader />;
};

export default ProjectJoinPage;
