import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  projectTaskDelete,
  projectTaskTransfer,
} from '../../../../redux/actions/projectActions';

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

const ArchivedMenu = ({ anchorEl, handleClose }) => {
  const dispatch = useDispatch();
  const { lists } = useSelector((state) => state.projectGetData);
  const [transferAnchorEl, setTransferAnchorEl] = useState(null);
  const [deleteAnchorEl, setDeleteAnchorEl] = useState(null);
  const [taskIndex, setTaskIndex] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const classes = useStyles();

  // Transfer menu actions | open, close, restore
  const openTransferMenu = (target, index, id) => {
    setTransferAnchorEl(target);
    setTaskIndex(index);
    setTaskId(id);
  };
  const closeTransferMenu = () => {
    setTransferAnchorEl(null);
    setTaskIndex(null);
    setTaskId(null);
  };

  const transferActionHandle = (newListIndex, newListId) => {
    dispatch(
      projectTaskTransfer(
        taskId,
        taskIndex,
        null,
        newListIndex,
        null,
        newListId,
        closeTransferMenu
      )
    );
  };

  // Delete menu actions | open, close, restore
  const openDeleteMenu = (target, index, taskId) => {
    setDeleteAnchorEl(target);
    setTaskIndex(index);
    setTaskId(taskId);
  };

  const closeDeleteMenu = () => {
    setDeleteAnchorEl(null);
    setTaskIndex(null);
  };

  const deleteTaskHandle = () => {
    dispatch(projectTaskDelete(taskId, taskIndex, () => closeDeleteMenu()));
  };

  return (
    <>
      <Popover
        disableScrollLock={true}
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
              lists.archivedTasks.map((task, taskIndex) => (
                <div key={task._id}>
                  <Task task={task} />
                  <ArchivedActions
                    taskId={task._id}
                    taskIndex={taskIndex}
                    openTransferMenu={openTransferMenu}
                    openDeleteMenu={openDeleteMenu}
                  />
                </div>
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
        transferActionHandle={transferActionHandle}
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
