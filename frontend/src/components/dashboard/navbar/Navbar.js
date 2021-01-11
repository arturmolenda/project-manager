import React from 'react';
import { useSelector } from 'react-redux';

import { makeStyles } from '@material-ui/core';

import DeveloperBoardIcon from '@material-ui/icons/DeveloperBoard';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 5,
    height: 'auto',
    zIndex: 1,
  },
  backgroundNav: {
    borderBottom: '1px solid #d8d8d8',
    background: '#ffffffd9',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: 51,
  },
  title: {
    margin: 0,
    padding: '0 3px',
    border: '2px solid transparent',
    color: theme.palette.primary.main,
    fontSize: '1.3em',
    fontWeight: 500,
  },
  boardIcon: {
    fontSize: 40,
    margin: 'auto 10px auto 0px',
  },
}));

const Navbar = () => {
  const { project } = useSelector((state) => state.projectSetCurrent);
  const classes = useStyles();

  return (
    <>
      <div className={classes.backgroundNav} />
      <div className={classes.container} style={{ position: 'fixed' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ display: 'flex' }}>
            <DeveloperBoardIcon color='primary' className={classes.boardIcon} />
            <div>
              {project && Object.keys(project).length > 0 && (
                <h1
                  id='project-title'
                  className={classes.title}
                  color='primary'
                >
                  {project.title}
                </h1>
              )}
            </div>
          </div>
          {/* Users */}
        </div>

        {/* Settings buttons */}
      </div>

      <div
        className={classes.container}
        style={{ visibility: 'hidden', marginBottom: 40 }}
      >
        <div style={{ display: 'flex' }}>
          <DeveloperBoardIcon color='primary' className={classes.boardIcon} />
        </div>
      </div>
    </>
  );
};

export default Navbar;
