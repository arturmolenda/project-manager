import React from 'react';
import { Link } from 'react-router-dom';

import { Button, makeStyles } from '@material-ui/core';
import Helmet from '../Helmet';

const useStyles = makeStyles((theme) => ({
  container: {
    margin: '25vh auto 0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    fontSize: '3.5em',
    padding: 10,

    '& h6': {
      margin: 0,
      color: '#a4a4a4',
      fontWeight: 100,
      fontSize: '1.2rem',
      textAlign: 'center',
    },
    '& h2': {
      margin: 0,
      color: '#fff',
      [theme.breakpoints.down('xs')]: {
        fontSize: '1.2em',
      },
    },
  },
}));

const NotFoundPage = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Helmet title={'Page not found'} />
      <h2>404...</h2>
      <h6 style={{ maxWidth: 500 }}>
        {' '}
        Such page does not exist. Head back to your projects!
      </h6>
      <Link
        to='/boards'
        style={{ textDecoration: 'none', marginTop: '10px', fontSize: 0 }}
      >
        <Button color='primary' variant='outlined' size='large'>
          Boards
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
