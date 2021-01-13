import React from 'react';

import { useSelector } from 'react-redux';
import { Container } from 'react-smooth-dnd';

import './draggingStyles.css';
import ListItem from './ListItem';
import AddInput from '../shared/AddInput';

const Lists = () => {
  const { lists } = useSelector((state) => state.projectGetData);
  const dropHandle = (e) => {
    console.log('dropped', e);
  };
  return (
    <div
      id='board-container'
      style={{
        maxWidth: '100%',
        display: 'flex',
        alignItems: 'flex-start',
        marginTop: '10vh',
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
          lists.lists.map((list) => <ListItem key={list._id} list={list} />)}
      </Container>
      <AddInput placeholder={'Add new list'} />
    </div>
  );
};

export default Lists;
