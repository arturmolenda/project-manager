import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from './navbar/Navbar';

const Board = () => {
  const { project, labels, tasks } = useSelector(
    (state) => state.projectGetData
  );
  return (
    <div>
      <Navbar />
    </div>
  );
};

export default Board;
