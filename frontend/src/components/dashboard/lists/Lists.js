import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { projectListMove } from '../../../redux/actions/projectActions';

import { Container } from 'react-smooth-dnd';

import './draggingStyles.css';
import ListItem from './ListItem';
import AddInput from '../shared/AddInput';

const Lists = () => {
  const { lists } = useSelector((state) => state.projectGetData);
  const dispatch = useDispatch();
  const dropHandle = ({ removedIndex, addedIndex }) => {
    if (removedIndex !== null && addedIndex !== null) {
      dispatch(projectListMove(removedIndex, addedIndex));
    }
  };

  return (
    <div
      id='board-container'
      style={{
        maxWidth: '100%',
        display: 'flex',
        marginTop: '2vh',
        overflowX: 'auto',
        padding: '0 4px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
        }}
      >
        <Container
          onDrop={dropHandle}
          orientation='horizontal'
          dragHandleSelector='.list-drag-handle'
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'cards-drop-preview',
          }}
          dragClass='list-drag-ghost'
        >
          {lists &&
            lists.lists.length > 0 &&
            lists.lists.map((list, index) => (
              <ListItem
                key={list._id}
                list={list}
                index={index}
                projectId={lists.projectId}
              />
            ))}
        </Container>
        <AddInput placeholder={'Add new list'} />
      </div>
    </div>
  );
};

export default Lists;
