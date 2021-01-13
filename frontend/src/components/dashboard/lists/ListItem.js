import React from 'react';

import { Container, Draggable } from 'react-smooth-dnd';

import { makeStyles, Paper } from '@material-ui/core';

import AddInput from '../shared/AddInput';
import TitleUpdate from './TitleUpdate';
import ListMore from './listMore/ListMore';

const useStyles = makeStyles(() => ({
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #ddd',
    borderRadius: '0.3rem',
    margin: '0 4px',
    width: '300px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    padding: '6px 8px',
    borderBottom: '1px solid #d0d3dc',
    backgroundColor: '#ebecf0',
    transition: 'background-color 0.2s ease',
    cursor: 'pointer !important',
    '&:hover': {
      backgroundColor: 'rgb(249, 249, 249) ',
    },
  },
  list: {
    maxHeight: '65vh',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    transition: 'background-color 0.2s ease',
    userSelect: 'none',
    padding: '4px 8px 0px',
  },
}));

const ListItem = ({ list }) => {
  const classes = useStyles();
  const dropHandle = (e) => {
    console.log('dropped', e);
  };
  return (
    <Draggable>
      <Paper elevation={3} className={classes.listContainer}>
        <div className={`list-drag-handle ${classes.header}`}>
          <TitleUpdate currentTitle={list.title} />
          <ListMore listId={list._id} />
        </div>

        <div
          className={classes.list}
          id={list._id}
          style={{ padding: list.tasks.length === 0 && 0 }}
        >
          <Container
            onDrop={dropHandle}
            groupName='col'
            dragClass='task-drag-ghost'
            dropPlaceholder={{
              animationDuration: 150,
              showOnTop: true,
              className: 'drop-preview',
            }}
          ></Container>
        </div>
        <AddInput listId={list._id} placeholder={'Add new task'} />
      </Paper>
    </Draggable>
  );
};

export default ListItem;
