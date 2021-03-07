import React from 'react';

import { makeStyles } from '@material-ui/core';

import TaskHeader from './modalComponents/TaskHeader';
import TaskDescription from './modalComponents/TaskDescription';
import SideContent from './modalComponents/SideContent';
import Deadline from './modalComponents/Deadline';
import Users from './modalComponents/users/Users';
import Labels from './modalComponents/Labels';
import ToDoList from './modalComponents/toDoLists/ToDoList';
import Comments from './modalComponents/comments/Comments';
import ArchivedHeader from './modalComponents/ArchivedHeader';

const useStyles = makeStyles((theme) => ({
  innerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 10,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
}));

const ModalContainer = ({ task, userPermissions, userId }) => {
  const classes = useStyles();
  return (
    <>
      {task && task.archived && <ArchivedHeader />}
      <div style={{ padding: '25px 10px 20px 20px' }}>
        {task && (
          <>
            <TaskHeader
              task={task}
              initialDescription={task.description}
              disabled={task.archived}
            />
            <div className={classes.innerContainer}>
              <div style={{ width: '100%' }}>
                <Labels labels={task.labels} />
                <Users
                  selectedUsers={task.users}
                  projectId={task.projectId}
                  taskId={task._id}
                  disabled={task.archived}
                />
                <TaskDescription
                  userPermissions={userPermissions}
                  task={task}
                  disabled={task.archived}
                />
                <Deadline task={task} disabled={task.archived} />
                {task.toDoLists.lists.map((list, index) => (
                  <ToDoList
                    key={list._id}
                    projectId={task.projectId}
                    taskId={task._id}
                    index={index}
                    list={list}
                    userId={userId}
                    disabled={task.archived}
                  />
                ))}
                <Comments
                  comments={task.comments}
                  projectId={task.projectId}
                  taskId={task._id}
                  disabled={task.archived}
                />
              </div>
              <SideContent task={task} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ModalContainer;
