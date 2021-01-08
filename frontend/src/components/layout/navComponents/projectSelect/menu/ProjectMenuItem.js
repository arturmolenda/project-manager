import React from 'react';
import { NavLink } from 'react-router-dom';

import { useDispatch } from 'react-redux';

import { makeStyles, MenuItem, Typography } from '@material-ui/core';

import { PROJECT_SET_CURRENT } from '../../../../../redux/constants/projectConstants';

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

const ProjectMenuItem = ({ project, index, setAnchorEl }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const clickHandle = () => {
    dispatch({ type: PROJECT_SET_CURRENT, payload: project });
    setAnchorEl(null);
  };
  return (
    <NavLink
      to={`/project/${project._id}`}
      className={classes.link}
      exact='true'
      key={index}
      activeClassName='active-project-link'
    >
      <MenuItem className={classes.container} onClick={clickHandle}>
        <Typography variant='subtitle2' className={classes.text}>
          {project.title}
        </Typography>
      </MenuItem>
    </NavLink>
  );
};

export default ProjectMenuItem;
