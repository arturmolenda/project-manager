import React from 'react';

import { makeStyles, Paper, Typography } from '@material-ui/core';

import { Container, Draggable } from 'react-smooth-dnd';

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
    padding: '7px 5px',
    borderBottom: '1px solid #d0d3dc',
    backgroundColor: '#ebecf0',
    transition: 'background-color 0.2s ease',
    cursor: 'pointer !important',
    '&:hover': {
      backgroundColor: 'rgb(242 242 245) ',
    },
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

        <div>
          <div className={classes.list}>
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
        </div>
        {/* Add Task input */}
      </Paper>
    </Draggable>
  );
};

export default ListItem;
