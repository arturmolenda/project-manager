import React from 'react';
import LinkIcon from '@material-ui/icons/Link';
import { Button, makeStyles, TextField, Typography } from '@material-ui/core';
import { useSelector } from 'react-redux';

const useStyles = makeStyles(() => ({
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  innerContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    marginLeft: 5,
    fontWeight: 600,
    color: '#0f386b',
  },
  linkBtn: {
    textDecoration: 'underline',
    cursor: 'pointer',
    userSelect: 'none',
  },
}));

const InviteLink = () => {
  const { project } = useSelector((state) => state.projectGetData);
  const { socket } = useSelector((state) => state.socketConnection);
  const classes = useStyles();
  const linkBtnAction = () => {
    project.joinIdActive
      ? socket.emit('project-disable-join-link', { projectId: project._id })
      : socket.emit('project-create-join-link', { projectId: project._id });
  };
  return (
    <div>
      <div className={classes.spaceBetween}>
        <div className={classes.innerContainer}>
          <LinkIcon />
          <Typography variant='subtitle2' className={classes.title}>
            Invite with Link
          </Typography>
        </div>
        <Typography
          variant='subtitle2'
          onClick={linkBtnAction}
          className={classes.linkBtn}
          color='primary'
        >
          {project.joinIdActive ? 'Disable Link' : 'Create Link'}
        </Typography>
      </div>
      <Typography variant='caption' style={{ color: '#9c9c9c' }}>
        Anyone having this link can join your project
      </Typography>
      {project.joinIdActive && (
        <div className={classes.spaceBetween} style={{ marginTop: 2 }}>
          <TextField
            variant='outlined'
            onFocus={(e) => e.currentTarget.select()}
            value={`http://localhost:3000/invite/${project._id}/${project.joinId}`}
            margin='dense'
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
          <Button
            color='primary'
            variant='contained'
            style={{ marginLeft: 10, marginTop: 2 }}
            onClick={() =>
              navigator.clipboard.writeText(
                `http://localhost:3000/invite/${project._id}/${project.joinId}`
              )
            }
          >
            Copy
          </Button>
        </div>
      )}
    </div>
  );
};

export default InviteLink;
