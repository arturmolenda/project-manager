import React, { useEffect, useState } from 'react';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { makeStyles, Button } from '@material-ui/core';

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

const TaskDescription = ({
  initialDescription,
  projectId,
  userPermissions,
}) => {
  const [descriptionEditOpen, setDescriptionEditOpen] = useState(false);
  const [description, setDescription] = useState('');
  const classes = useStyles();
  useEffect(() => {
    setDescription(initialDescription);
  }, [initialDescription]);
  const updateHandle = () => {
    if (description !== initialDescription) {
    }
  };

  return (
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
        disabled={userPermissions < 1}
        data={initialDescription}
        onBlur={(event, editor) => setDescriptionEditOpen(false)}
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
            disabled={description === initialDescription}
            onClick={updateHandle}
          >
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskDescription;
