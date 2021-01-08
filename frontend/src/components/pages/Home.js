import React from 'react';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';

import { Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '25vh auto 0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '3.5em',
    padding: 10,
    '& h1,h2,h6': {
      margin: 0,
    },
    '& h6': {
      color: '#a4a4a4',
      fontWeight: 100,
      fontSize: '1.2rem',
      textAlign: 'center',
    },
    '& h1,h2': {
      color: '#fff',
      [theme.breakpoints.down('xs')]: {
        fontSize: '1.2em',
      },
    },
    '& p': {
      fontSize: '.875rem',
      color: '#fff',
      '& a': {
        color: '#02b6ce',
      },
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const { userInfo } = useSelector((state) => state.userLogin);
  return (
    <div className={classes.container}>
      {userInfo ? (
        <>
          <h2>Welcome back!</h2>
          <h6 style={{ maxWidth: 500 }}>
            There is no time to waste exploring, head back to your boards
            screen, now!
          </h6>
          <Link
            to='/boards'
            style={{ textDecoration: 'none', marginTop: '10px', fontSize: 0 }}
          >
            <Button color='primary' variant='outlined' size='large'>
              Boards
            </Button>
          </Link>
        </>
      ) : (
        <>
          <h1>Welcome!</h1>
          <h6 style={{ maxWidth: 500 }}>
            Project Manager is an app that helps you with productivity and
            maintaining order in your project
          </h6>
          <Link
            to='/register'
            style={{ textDecoration: 'none', marginTop: '10px', fontSize: 0 }}
          >
            <Button color='primary' variant='outlined' size='large'>
              Get Started
            </Button>
          </Link>
          <p className={classes.paragraph}>
            Already a user? <Link to='/signin'>Sign in</Link>{' '}
          </p>
        </>
      )}
    </div>
  );
};

export default Home;