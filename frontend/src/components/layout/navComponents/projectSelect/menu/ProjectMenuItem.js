import React from 'react';
import { NavLink } from 'react-router-dom';

import { makeStyles, MenuItem, Typography } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  container: {
    color: '#4e4949',
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

const ProjectMenuItem = ({ project, setAnchorEl }) => {
  const classes = useStyles();

  return (
    <NavLink
      to={`/project/${project._id}`}
      className={classes.link}
      exact
      activeClassName='active-project-link'
    >
      <MenuItem className={classes.container} onClick={() => setAnchorEl(null)}>
        <Typography variant='subtitle2' className={classes.text}>
          {project.title}
        </Typography>
      </MenuItem>
    </NavLink>
  );
};

export default ProjectMenuItem;
