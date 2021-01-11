import React from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'react-smooth-dnd';
import ListItem from './ListItem';

const Lists = () => {
  const { lists } = useSelector((state) => state.projectGetData);
  const dropHandle = (e) => {
    console.log('dropped', e);
  };
  return (
    <>
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
    </>
  );
};

export default Lists;
