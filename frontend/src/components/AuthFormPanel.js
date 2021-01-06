import React from 'react';
import { Link } from 'react-router-dom';

import { makeStyles, Typography } from '@material-ui/core';

import PolygonBackground from '../images/PolygonBackground.jpg';

const useStyles = makeStyles(() => ({
  container: (props) => ({
    backgroundImage: `url(${PolygonBackground})`,
    width: '50%',
    padding: 20,
    borderRadius: props.login ? '0 20px 20px 0' : '20px 0 0 20px',
    '@media (max-width: 768px)': {
      width: '100%',
      borderRadius: '0 0 20px 20px',
    },
  }),
  innerContainer: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    '& h1': {
      fontSize: '2.5rem',
    },
    '& h6': {
      fontSize: '.9rem',
      color: '#cacaca',
      marginTop: 10,
    },
  },
  customButton: {
    padding: '4px 45px',
    backgroundColor: 'transparent',
    border: '2px solid #fff',
    borderRadius: 50,
    color: '#fff',
    fontSize: '1rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: '.2s ease',
    '&:hover': {
      backgroundColor: '#fff',
      color: '#000',
    },
  },
  link: {
    textDecoration: 'none',
    marginTop: 10,
  },
}));
const AuthFormPanel = ({ login }) => {
  const classes = useStyles({ login });
  return (
    <div className={classes.container}>
      <div className={classes.innerContainer}>
        <Typography
          variant='h1'
          align='center'
          style={{ fontFamily: 'Segoe UI' }}
        >
          {login ? 'Welcome Back!' : 'Hi there!'}
        </Typography>
        <Typography variant='h6' align='center'>
          {login
            ? 'To check on your projects sing in using your personal details'
            : 'Register to keep your productivity and project flow at highest levels possible!'}
        </Typography>
        <Link to={login ? '/signin' : '/register'} className={classes.link}>
          <div className={classes.customButton}>
            {login ? 'SIGN IN' : 'SIGN UP'}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AuthFormPanel;
