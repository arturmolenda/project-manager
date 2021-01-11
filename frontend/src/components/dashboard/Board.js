import React from 'react';
import { useSelector } from 'react-redux';
import Lists from './lists/Lists';
import Navbar from './navbar/Navbar';

const Board = () => {
  const { project, labels, tasks } = useSelector(
    (state) => state.projectGetData
  );
  return (
    <div>
      <Navbar />
      <Lists />
    </div>
  );
};

export default Board;
