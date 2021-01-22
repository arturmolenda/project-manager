import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import { Typography, makeStyles, Popover } from '@material-ui/core';

import Task from '../../lists/tasks/Task';
import DeleteMenu from '../../shared/DeleteMenu';
import ArchivedActions from './ArchivedActions';
import TransferMenu from './TransferMenu';

const useStyles = makeStyles((theme) => ({
  container: {
    width: 300,
    outline: 'none',
  },
  emptyArchive: {
    height: 60,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#efefef',
    color: '#686464',
    marginBottom: 7,
  },
  innerItems: {
    padding: '4px 4px 0px 4px',
    margin: '0 3px',
    overflowY: 'auto',
    maxHeight: 600,
  },
  header: {
    backgroundColor: theme.palette.primary.main,
    padding: '2px 0',
    textAlign: 'center',
    borderBottom: 'none',
    color: '#fff',
    '& h6': { fontWeight: 700 },
  },
}));

const ArchivedMenu = ({ anchorEl, handleClose, projectId }) => {
  const { lists } = useSelector((state) => state.projectGetData);
  const [transferAnchorEl, setTransferAnchorEl] = useState(null);
  const [deleteAnchorEl, setDeleteAnchorEl] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const classes = useStyles();

  // Transfer menu actions | open, close, restore
  const openTransferMenu = (target, id) => {
    setTransferAnchorEl(target);
    setTaskId(id);
  };
  const closeTransferMenu = () => {
    setTransferAnchorEl(null);
    setTaskId(false);
  };

  const restoreTaskHandle = (listId) => {
    console.log('restoreTask', listId, taskId);
  };

  // Delete menu actions | open, close, restore
  const openDeleteMenu = (target, id) => {
    setDeleteAnchorEl(target);
    setTaskId(id);
  };

  const closeDeleteMenu = () => {
    setDeleteAnchorEl(null);
    setTaskId(false);
  };

  const deleteTaskHandle = () => {
    console.log('delete');
  };

  return (
    <>
      <Popover
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        PaperProps={{
          style: { borderTopLeftRadius: 8, borderTopRightRadius: 8 },
        }}
        transitionDuration={0}
      >
        <div className={classes.container}>
          <div className={classes.header}>
            <Typography variant='subtitle1'>Archived Tasks</Typography>
          </div>
          <div className={classes.innerItems}>
            {lists.archivedTasks &&
              lists.archivedTasks.length > 0 &&
              lists.archivedTasks.map((task) => (
                <>
                  <Task task={task} projectId={projectId} archived={true} />
                  <ArchivedActions
                    taskId={task.id}
                    openTransferMenu={openTransferMenu}
                    openDeleteMenu={openDeleteMenu}
                  />
                </>
              ))}
            {lists.archivedTasks && lists.archivedTasks.length === 0 && (
              <div className={classes.emptyArchive}>No Archived Tasks</div>
            )}
          </div>
        </div>
      </Popover>
      <TransferMenu
        anchorEl={transferAnchorEl}
        closeHandle={closeTransferMenu}
        restoreTaskHandle={restoreTaskHandle}
      />
      <DeleteMenu
        anchorEl={deleteAnchorEl}
        headerTitle='Delete task?'
        handleClose={closeDeleteMenu}
        deleteHandle={deleteTaskHandle}
        text={'Deleting a task cannot be undone, are you sure?'}
      />
    </>
  );
};

export default ArchivedMenu;
