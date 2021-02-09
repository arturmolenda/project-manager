import { Button, makeStyles, TextField, Typography } from '@material-ui/core';
import React from 'react';
import DoneIcon from '@material-ui/icons/Done';

const useStyles = makeStyles(() => ({
  container: {
    marginTop: 10,
  },
  textfieldContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  textfield: {
    marginBottom: 7,
    '& input': {
      padding: '6px 8px',
    },
  },
  colorsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  caption: {
    fontWeight: 600,
    color: '#979a9a',
  },
  colorItem: {
    width: 48,
    height: 32,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    margin: 5,
    cursor: 'pointer',
  },
}));

const CreateLabel = ({
  colors,
  selectedColor,
  title,
  setTitle,
  setSelectedColor,
  saveHandle,
  setDeleteOpen,
  edit,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <div className={classes.textfieldContainer}>
        <Typography variant='caption' className={classes.caption}>
          Title
        </Typography>
        <TextField
          variant='outlined'
          className={classes.textfield}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <Typography variant='caption' className={classes.caption}>
        Color
      </Typography>
      <div className={classes.colorsContainer}>
        {colors &&
          colors.map((color, i) => (
            <div
              key={i}
              className={classes.colorItem}
              style={{
                backgroundColor: color,
                border: color === '#FFF' && '1px solid #bec0c0',
              }}
              onClick={() => setSelectedColor(color)}
            >
              {selectedColor === color && (
                <DoneIcon
                  style={{ fill: color === '#FFF' ? '#000' : '#fff' }}
                />
              )}
            </div>
          ))}
      </div>
      <div className={classes.actionsContainer}>
        {edit && (
          <Button color='secondary' onClick={() => setDeleteOpen(true)}>
            Delete
          </Button>
        )}
        <Button color='primary' onClick={saveHandle}>
          {edit ? 'Save' : 'Add'}
        </Button>
      </div>
    </div>
  );
};

export default CreateLabel;
