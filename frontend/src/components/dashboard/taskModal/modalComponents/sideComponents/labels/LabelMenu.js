import React, { useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  createLabel,
  deleteLabel,
  editLabel,
  updateLabels,
} from '../../../../../../redux/actions/projectActions';

import { Button, makeStyles, Menu, Typography } from '@material-ui/core';

import { LABEL_COLORS } from '../../../../../../util/colorsContants';
import MenuHeader from '../../../../shared/MenuHeader';
import DeleteMenu from '../../../../shared/DeleteMenu';
import CreateLabel from './CreateLabel';
import LabelItem from './LabelItem';

const useStyles = makeStyles(() => ({
  container: {
    width: 270,
    outline: 'none',
  },
  innerContainer: {
    padding: '0 10px',
    marginTop: 10,
    overflowY: 'auto',
    maxHeight: 350,
    display: 'flex',
    flexDirection: 'column',
  },
  caption: {
    fontWeight: 600,
    color: '#979a9a',
  },
  createBtn: {
    padding: '0 10px',
    marginTop: 5,
    '& > button': {
      background: 'rgba(0,0,0,0.07)',
      '&:hover': {
        background: 'rgba(0,0,0,0.15)',
      },
    },
  },
}));

const LabelMenu = ({ task, anchorEl, handleClose, listIndex, taskIndex }) => {
  const { labels } = useSelector((state) => state.projectGetData);
  const { socket } = useSelector((state) => state.socketConnection);
  const dispatch = useDispatch();
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#49E4DA');
  const [title, setTitle] = useState('');
  const [labelId, setLabelId] = useState('');
  const classes = useStyles();

  const resetHandle = () => {
    setSelectedColor('#49E4DA');
    setTitle('');
    setLabelId('');
    setCreatorOpen(false);
    setDeleteOpen(false);
  };
  const closeHandle = () => {
    handleClose();
    resetHandle();
  };

  const editHandle = (label) => {
    setCreatorOpen('Edit Label');
    setSelectedColor(label.color);
    setTitle(label.title);
    setLabelId(label._id);
  };
  const saveHandle = () => {
    if (labelId) {
      dispatch(editLabel(labelId, title, selectedColor, () => resetHandle()));
    } else {
      socket.emit(
        'create-label',
        {
          taskId: task._id,
          projectId: task.projectId,
          color: selectedColor,
          title,
        },
        (label) =>
          dispatch(
            createLabel(listIndex, taskIndex, task._id, label, () =>
              resetHandle()
            )
          )
      );
    }
  };
  const selectHandle = (labelId, selected) => {
    let newLabels = [...task.labels];
    if (selected) newLabels = newLabels.filter((id) => id !== labelId);
    else newLabels.push(labelId);
    dispatch(
      updateLabels(task._id, task.projectId, newLabels, listIndex, taskIndex)
    );
  };
  const deleteHandle = () => {
    dispatch(deleteLabel(labelId, () => resetHandle()));
  };

  return (
    <Menu
      anchorEl={anchorEl}
      keepMounted
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
        {deleteOpen ? (
          <DeleteMenu
            Header={
              <MenuHeader
                goBackHandle={() => setDeleteOpen(false)}
                title='Delete label?'
                handleClose={closeHandle}
              />
            }
            deleteHandle={deleteHandle}
            text='Deleting a Label cannot be undone, are you sure?'
          />
        ) : creatorOpen ? (
          <>
            <MenuHeader
              goBackHandle={resetHandle}
              title={creatorOpen}
              handleClose={handleClose}
            />
            <div className={classes.innerContainer}>
              <CreateLabel
                colors={LABEL_COLORS}
                selectedColor={selectedColor}
                title={title}
                setTitle={setTitle}
                setSelectedColor={(color) => setSelectedColor(color)}
                saveHandle={saveHandle}
                edit={Boolean(labelId)}
                setDeleteOpen={setDeleteOpen}
              />
            </div>
          </>
        ) : (
          <>
            <MenuHeader title='Label' handleClose={handleClose} />
            <div className={classes.innerContainer}>
              <Typography variant='caption' className={classes.caption}>
                LABELS
              </Typography>
              {labels &&
                labels.labelIds.map((labelId) => (
                  <LabelItem
                    key={labelId}
                    label={labels.labels[labelId]}
                    editHandle={editHandle}
                    taskLabels={task.labels}
                    selectHandle={selectHandle}
                  />
                ))}
            </div>
            <div className={classes.createBtn}>
              <Button fullWidth onClick={() => setCreatorOpen('Create Label')}>
                Create new label
              </Button>
            </div>
          </>
        )}
      </div>
    </Menu>
  );
};

export default LabelMenu;
