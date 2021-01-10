import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { makeStyles, Typography, Grid } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import LazyImage from './LazyImage';

const useStyles = makeStyles(() => ({
  container: {
    height: 130,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    wordBreak: 'break-all',
    position: 'relative',
    transition: 'background-color 0.2s ease',
    '&:hover': {
      '& div': {
        backgroundColor: 'rgba(0, 0, 0, 0) !important',
      },
    },
  },
  textContrastKeeper: {
    transition: 'background-color 0.1s ease',
    position: 'absolute',
    height: '100%',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 1,
    borderRadius: 5,
  },
  link: {
    textDecoration: 'none',
  },
  text: {
    color: '#fff',
    fontWeight: 600,
    padding: '10px 0 0 10px',
    position: 'absolute',
    top: 0,
    zIndex: 2,
  },
  skeleton: {
    height: '100%',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    borderRadius: 5,
  },
}));

const BoardItem = ({ project }) => {
  const classes = useStyles();

  const { color, size, position, repeat, image } = project.background;
  let imgLoaded;
  if (!color && image) {
    imgLoaded = LazyImage(image);
  }

  return (
    <Fragment>
      <Grid item lg={3} md={4} sm={6} xs={6}>
        <Link to={`/project/${project._id}`} className={classes.link}>
          <div
            className={classes.container}
            style={{
              backgroundImage: color && color,
            }}
          >
            {!color && image && (
              <Fragment>
                {imgLoaded ? (
                  <div
                    style={{
                      backgroundImage: `url(${imgLoaded})`,
                      backgroundSize: size,
                      backgroundPosition: position,
                      backgroundRepeat: repeat,
                      height: '100%',
                      width: '100%',
                      borderRadius: 5,
                    }}
                  />
                ) : (
                  <Skeleton variant='rect' className={classes.skeleton} />
                )}
              </Fragment>
            )}
            <Typography variant='subtitle2' className={classes.text}>
              {project.title.length < 90
                ? project.title
                : `${project.title.substring(0, 90)}...`}
            </Typography>
            <div
              className={`${classes.textContrastKeeper} contrast-div`}
              style={{
                backgroundColor:
                  !color && image
                    ? imgLoaded
                      ? 'rgba(0, 0, 0, 0.2)'
                      : 'initial'
                    : 'rgba(0, 0, 0, 0.2)',
              }}
            />
          </div>
        </Link>
      </Grid>
    </Fragment>
  );
};

export default BoardItem;
