import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import {
  projectListDelete,
  projectTasksArchive,
  projectTasksTransfer,
} from '../../../../redux/actions/projectActions';

import { Menu, makeStyles, MenuItem, Divider } from '@material-ui/core';

import MenuHeader from '../../shared/MenuHeader';
import DeleteMenu from '../../shared/DeleteMenu';
import TransferTasks from './TransferTasks';

const useStyles = makeStyles(() => ({
  container: {
    width: 270,
    outline: 'none',
  },
  menuItem: {
    fontSize: '.85rem',
  },
  divider: {
    margin: '5px 9px',
  },
}));

const ListMenu = ({ anchorEl, handleClose, listId, listIndex }) => {
  const dispatch = useDispatch();
  const [deleteMenu, setDeleteMenu] = useState(false);
  const [transferMenuOpen, setTransferMenuOpen] = useState(false);
  const classes = useStyles();

  const closeHandle = () => {
    handleClose();
    setDeleteMenu(false);
    setTransferMenuOpen(false);
  };

  const deleteMenuHandle = (e) => {
    const btnText = e.target.innerText.split(' ')[0];
    setDeleteMenu({
      open: true,
      title: e.target.innerText,
      text:
        btnText === 'Delete'
          ? 'Are you sure you want to delete a list and archive tasks inside? This action cannot be undone'
          : 'Are you sure you want to archive tasks inside this list? This action cannot be undone',
      btnText: btnText,
    });
  };
  const addTaskHandle = () => {
    handleClose();
    setTimeout(
      () => document.getElementById(`task-input-${listId}`).focus(),
      1
    );
  };
  const deleteListHandle = () => {
    // delete list and archive tasks inside
    dispatch(projectListDelete(listIndex, listId, () => closeHandle()));
  };
  const archiveTasksHandle = () => {
    dispatch(projectTasksArchive(listIndex, () => closeHandle()));
  };

  const transferHandle = (newListIndex) => {
    dispatch(
      projectTasksTransfer(listIndex, newListIndex, () => closeHandle())
    );
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={closeHandle}
      getContentAnchorEl={null}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transitionDuration={0}
    >
      <div className={classes.container}>
        {deleteMenu.open && (
          <DeleteMenu
            Header={
              <MenuHeader
                goBackHandle={() => setDeleteMenu(false)}
                title={deleteMenu.title}
                handleClose={closeHandle}
              />
            }
            deleteHandle={
              deleteMenu.btnText === 'Delete'
                ? deleteListHandle
                : archiveTasksHandle
            }
            text={deleteMenu.text}
            buttonText={deleteMenu.btnText}
          />
        )}
        {transferMenuOpen && (
          <TransferTasks
            listId={listId}
            goBackHandle={() => setTransferMenuOpen(false)}
            handleClose={closeHandle}
            transferHandle={transferHandle}
          />
        )}
        {!deleteMenu.open && !transferMenuOpen && (
          <div>
            <MenuHeader handleClose={closeHandle} title={'List Actions'} />
            <MenuItem
              className={classes.menuItem}
              style={{ marginTop: 5 }}
              onClick={addTaskHandle}
            >
              Add new task
            </MenuItem>
            <MenuItem
              className={classes.menuItem}
              onClick={() => setTransferMenuOpen(true)}
            >
              Transfer tasks to other list
            </MenuItem>
            <Divider className={classes.divider} />
            <MenuItem className={classes.menuItem} onClick={deleteMenuHandle}>
              Archive tasks inside
            </MenuItem>
            <MenuItem className={classes.menuItem} onClick={deleteMenuHandle}>
              Delete List and archive tasks inside
            </MenuItem>
          </div>
        )}
      </div>
    </Menu>
  );
};

export default ListMenu;
