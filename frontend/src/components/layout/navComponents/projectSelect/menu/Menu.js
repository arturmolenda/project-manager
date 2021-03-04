import React from 'react';
import { useSelector } from 'react-redux';

import {
  Typography,
  makeStyles,
  Popper,
  ClickAwayListener,
  Paper,
} from '@material-ui/core';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';

import ProjectMenuItem from './ProjectMenuItem';

const useStyles = makeStyles((theme) => ({
  section: {
    background: theme.palette.primary.main,
    position: 'sticky',
    top: 0,
    zIndex: 1,
    padding: '5px 5px 5px 10px',
    borderBottom: '1px solid #ccc',
    borderTop: '1px solid #ccc',
    '& h6': {
      fontSize: 14,
      color: '#fff',
      fontWeight: 600,
    },
  },
  container: {
    maxHeight: 300,
    width: 209,
    outline: 'none',
    overflow: 'auto',
  },
  link: {
    textDecoration: 'none',
  },
  text: {
    fontWeight: 600,
    color: '#585b5f',
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
}));

const Menu = ({ anchorEl, setAnchorEl }) => {
  const {
    loading,
    userInfo,
    userInfo: { projectsJoined, projectsCreated },
  } = useSelector((state) => state.userLogin);
  const classes = useStyles();
  return (
    <Popper
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
      transition
      style={{ zIndex: 111111 }}
    >
      <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
        <Paper className={classes.container}>
          {!loading &&
          userInfo &&
          Object.keys(userInfo).length !== 1 &&
          (projectsJoined.length !== 0 || projectsCreated.length !== 0) ? (
            <>
              {projectsCreated.length !== 0 && (
                <>
                  <div className={classes.section}>
                    <Typography variant='h6'>Owned Projects</Typography>
                  </div>
                  {projectsCreated.map((project) => (
                    <div key={project._id}>
                      <ProjectMenuItem
                        project={project}
                        setAnchorEl={setAnchorEl}
                      />
                    </div>
                  ))}
                </>
              )}
              {projectsJoined.length !== 0 && (
                <>
                  <div className={classes.section}>
                    <Typography variant='h6'>Joined Projects</Typography>
                  </div>
                  {projectsJoined.map((project) => (
                    <div key={project._id}>
                      <ProjectMenuItem
                        project={project}
                        setAnchorEl={setAnchorEl}
                      />
                    </div>
                  ))}
                </>
              )}
            </>
          ) : (
            <div
              style={{
                height: 250,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <EmojiObjectsIcon
                style={{ height: 56, width: 56, color: '#979a9a' }}
              />
              <Typography variant='h5' style={{ color: '#979a9a' }}>
                So empty...
              </Typography>
            </div>
          )}
        </Paper>
      </ClickAwayListener>
    </Popper>
  );
};

export default Menu;
