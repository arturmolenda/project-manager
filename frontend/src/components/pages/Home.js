import React from 'react';
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core';
import ParticlesBackground from '../ParticlesBackground';

const useStyles = makeStyles(() => ({
  container: {
    margin: '20vh auto 0 auto',
    maxWidth: 500,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '3.5em',
    '& h1,h6': {
      margin: 0,
    },
    '& h6': {
      color: '#a4a4a4',
      fontWeight: 100,
      fontSize: '1.2rem',
      textAlign: 'center',
    },
    '& h1': {
      color: '#fff',
    },
    '& p': {
      fontSize: '.875rem',
      color: '#fff',
      '& a': {
        color: '#02b6ce',
      },
    },
  },
  customButton: {
    marginTop: 20,
    padding: '4px 60px',
    fontWeight: 600,
    backgroundColor: 'transparent',
    border: '2px solid #00bcd4',
    borderRadius: 4,
    color: '#00bcd4',
    fontSize: '1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: '.1s ease',
    '&:hover': {
      backgroundColor: '#00bcd4',
      color: '#000',
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  return (
    <>
      <ParticlesBackground />
      <div className={classes.container}>
        <h1>Welcome!</h1>
        <h6>
          Project Manager is an app that helps you with productivity and
          maintaining order in your project
        </h6>
        <Link to='/register' style={{ textDecoration: 'none' }}>
          <div className={classes.customButton}>Get Started</div>
        </Link>
        <p className={classes.paragraph}>
          Already a user? <Link to='/signin'>Sign in</Link>{' '}
        </p>
      </div>
    </>
  );
};

export default Home;
