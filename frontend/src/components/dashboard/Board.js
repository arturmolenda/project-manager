import React from 'react';
import { useSelector } from 'react-redux';

const Board = () => {
  const { project, labels, tasks } = useSelector(
    (state) => state.projectGetData
  );
  return (
    <div>
      <h1>{project.title}</h1>
    </div>
  );
};

export default Board;
