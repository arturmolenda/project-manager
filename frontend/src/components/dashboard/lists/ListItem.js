import React from 'react';

import { useDispatch } from 'react-redux';
import { projectTaskMove } from '../../../redux/actions/projectActions';

import { Container, Draggable } from 'react-smooth-dnd';

import { makeStyles, Paper } from '@material-ui/core';

import AddInput from '../shared/AddInput';
import TitleUpdate from './TitleUpdate';
import ListMore from './listMore/ListMore';
import Task from './tasks/Task';

import equal from 'fast-deep-equal';

const useStyles = makeStyles(() => ({
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    border: '1px solid #ddd',
    borderRadius: '0.3rem',
    margin: '0 4px',
    width: '270px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    padding: '4px 8px',
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
    transition: 'background-color 0.2s ease',
    userSelect: 'none',
    padding: '4px 3px 0px 3px',
    margin: '0 2px',
  },
}));

const ListItem = React.memo(
  ({ list, projectId, index }) => {
    const classes = useStyles();
    const dispatch = useDispatch();

    const dropHandle = (dropResult) => {
      // Handle task move
      // Need to store data until both addedIndex and removedIndex are ready
      // react-smooth-dnd designed this function to be called in each list and
      // give either nothing in res or added or removed or both if move is within one list
      if (dropResult.removedIndex === dropResult.addedIndex) return;
      if (dropResult.added !== null || dropResult.removed !== null) {
        dispatch(
          projectTaskMove(dropResult, index, projectId, dropResult.payload)
        );
      }
    };

    const getTaskPayload = (taskIndex) => list.tasks[taskIndex];

    return (
      <Draggable draggableid={list._id} index={index}>
        <Paper elevation={3} className={classes.listContainer}>
          <div className={`list-drag-handle ${classes.header}`}>
            <TitleUpdate
              currentTitle={list.title}
              listIndex={index}
              projectId={projectId}
            />
            <ListMore listId={list._id} listIndex={index} />
          </div>

          <div className={classes.list} id={list._id}>
            <Container
              onDrop={dropHandle}
              groupName='col'
              dragClass='task-drag-ghost'
              animationDuration={0}
              dropPlaceholder={{
                showOnTop: true,
                className: 'drop-preview',
              }}
              disableScrollOverlapDetection={true}
              getChildPayload={(index) => getTaskPayload(index)}
            >
              {list.tasks.length > 0 &&
                list.tasks.map((task, i) => (
                  <Task
                    key={task._id}
                    index={i}
                    listIndex={index}
                    task={task}
                  />
                ))}
            </Container>
          </div>
          <AddInput listId={list._id} placeholder={'Add new task'} />
        </Paper>
      </Draggable>
    );
  },
  (prevProps, nextProps) => {
    return equal(prevProps, nextProps);
  }
);

export default ListItem;
