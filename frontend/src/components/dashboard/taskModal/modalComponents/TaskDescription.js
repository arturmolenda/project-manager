import React, { useEffect, useState } from 'react';

import { useDispatch } from 'react-redux';
import { taskFieldUpdate } from '../../../../redux/actions/projectActions';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { makeStyles, Button, ClickAwayListener } from '@material-ui/core';

import Loader from '../../../Loader';

const useStyles = makeStyles(() => ({
  root: {
    '& .ck-editor__editable_inline': {
      minHeight: 100,
    },
  },
  textContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    '& svg': {
      marginRight: 15,
    },
  },
  text: {
    display: 'flex',
    alignItems: 'center',
  },

  description: {
    margin: '8px 25px',
  },
  descriptionTextArea: {
    '& .MuiFilledInput-multiline': {
      padding: '15px 10px',
      fontSize: '0.95rem',
      color: '#525252',
    },
    '& .MuiFilledInput-multiline:before': {
      borderBottomStyle: 'solid',
    },
  },

  actions: {
    marginTop: 10,
    textAlign: 'right',
  },
  caption: {
    color: '#979a9a',
  },
}));

const TaskDescription = ({ taskId, task, projectId, userPermissions }) => {
  const dispatch = useDispatch();
  const [descriptionEditOpen, setDescriptionEditOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const classes = useStyles();
  useEffect(() => {
    setDescription(task.description);
  }, [task.description]);
  const updateHandle = () => {
    if (description !== task.description) {
      setLoading(true);
      dispatch(
        taskFieldUpdate(
          task._id,
          task.projectId,
          description,
          'description',
          () => {
            setLoading(false);
            setDescriptionEditOpen(false);
          }
        )
      );
    }
  };
  return (
    <ClickAwayListener
      mouseEvent={'onMouseDown'}
      onClickAway={() => !loading && setDescriptionEditOpen(false)}
    >
      <div className={classes.root}>
        <CKEditor
          editor={ClassicEditor}
          config={{
            toolbar: userPermissions >= 1 && [
              'heading',
              '|',
              'bold',
              'italic',
              'blockQuote',
              'link',
              'numberedList',
              'bulletedList',
              'alignment',
              'insertTable',
              '|',
              'undo',
              'redo',
            ],
          }}
          disabled={userPermissions < 1 || loading}
          data={task.description}
          onChange={(event, editor) => setDescription(editor.getData())}
          onFocus={(event, editor) => setDescriptionEditOpen(true)}
        />
        {descriptionEditOpen && (
          <div className={classes.actions}>
            <Button
              color='secondary'
              onClick={() => setDescriptionEditOpen(false)}
            >
              Cancel
            </Button>
            <Button
              color='primary'
              variant='outlined'
              disabled={description === task.description || loading}
              onClick={updateHandle}
            >
              Save
              {loading && <Loader button />}
            </Button>
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default TaskDescription;
