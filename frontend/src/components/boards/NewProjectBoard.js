import React, { Fragment, useState } from 'react';

import { makeStyles, Typography, Grid } from '@material-ui/core';

import NewProjectModal from '../layout/navComponents/NewProjectModal';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 130,
    borderRadius: 5,
    padding: 10,
    backgroundColor: 'rgba(255,255,255, 0.2)',
    color: '#fff',
    cursor: 'pointer',
    transition: 'background 0.1s ease',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255, 0.4)',
    },
  },
  text: {
    fontWeight: 600,
  },
}));

const NewProjectBoard = () => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  return (
    <Fragment>
      <Grid item lg={3} md={4} sm={6} xs={6}>
        <div className={classes.container} onClick={() => setOpen(true)}>
          <Typography variant='subtitle2' className={classes.text}>
            Create new project
          </Typography>
        </div>
      </Grid>
      <NewProjectModal open={open} handleClose={() => setOpen(false)} />
    </Fragment>
  );
};

export default NewProjectBoard;
