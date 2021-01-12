import React from 'react';

import { makeStyles, Paper, Typography } from '@material-ui/core';

import { Container, Draggable } from 'react-smooth-dnd';
import AddTask from './tasks/AddTask';

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
    alignItems: 'center',
    padding: '10px 8px',
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
          <Typography variant='body1'>{list.title}</Typography>
          {/* List More options */}
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
          >
            {/* Tasks */}
          </Container>
        </div>
        <AddTask listId={list._id} />
      </Paper>
    </Draggable>
  );
};

export default ListItem;
