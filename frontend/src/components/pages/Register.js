import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/actions/userActions';

import { makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import AuthFormPanel from '../AuthFormPanel';
import Loader from '../Loader';
import Helmet from '../Helmet';

const useStyles = makeStyles(() => ({
  loading: {
    position: 'absolute',
    color: '#ccc',
  },
  gridContainer: {
    backgroundColor: '#fff',
    boxShadow: '0px 0px 15px -4px',
    borderRadius: 23,
    display: 'flex',
    justifyContent: 'flex-start',
    height: 400,
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      height: 'auto',
    },
  },
  mainContainer: {
    padding: '25px 50px',
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '& h1': {
      fontSize: '2.5rem',
      color: '#00bcd4',
      fontFamily: 'Segoe UI',
      fontWeight: 400,
    },
    '@media (max-width: 768px)': {
      width: '100%',
      padding: '20px 50px',
    },
    '@media (min-width: 768px) and (max-width: 1500px)': {
      padding: '50px 20px',
    },
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputField: {
    marginBottom: 10,
    '& input': {
      padding: '11px 10px',
    },
    '& label': {
      transform: 'translate(10px, 13px) scale(1)',
    },
    '&:first-child': {
      marginTop: 20,
    },
    '&:nth-of-type(3)': {
      marginBottom: 10,
      display: 'flex',
      alignItems: 'center',
    },
  },
  customError: {
    fontSize: '0.775rem',
    color: '#f44336',
    marginBottom: 10,
  },
  infoMessage: {
    color: 'rgb(13, 60, 97)',
    background: '#49aaff3d',
    padding: 7,
    borderRadius: 3,
    marginBottom: 10,
    fontSize: '0.775rem',
  },
  smallText: {
    textAlign: 'center',
    fontSize: '.75rem',
    margin: '5px 0 0 0',
  },
}));

const Register = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const history = useHistory();

  const { loading, error, success } = useSelector(
    (state) => state.userRegister
  );
  const { userInfo: userLoggedIn } = useSelector((state) => state.userLogin);
  useEffect(() => {
    if (userLoggedIn) history.push('/boards');
  }, [dispatch, history, userLoggedIn]);

  const validate = () => {
    let returnVal = true;
    // eslint-disable-next-line
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(email.toLowerCase())) {
      returnVal = false;
      setEmailError('Please use full email address (i.e., john@example.com)');
    } else {
      returnVal = returnVal ? returnVal : false;
      setEmailError('');
    }
    if (username.trim() !== '') {
      returnVal = returnVal ? returnVal : false;
      setUsernameError('');
    } else {
      returnVal = false;
      setPasswordError('Cannot be empty');
    }
    if (password.length >= 7) {
      returnVal = returnVal ? returnVal : false;
      setPasswordError('');
    } else {
      returnVal = false;
      setPasswordError('Must be at least 7 characters long');
    }
    return returnVal;
  };

  const emailChange = (e) => {
    setEmailError('');
    setEmail(e.target.value);
  };
  const passwordChange = (e) => {
    setPasswordError('');
    setPassword(e.target.value);
  };
  const usernameChange = (e) => {
    setUsernameError('');
    setUsername(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValidated = validate();
    if (isValidated) {
      dispatch(register(username, email, password));
    }
  };

  return (
    <div className={classes.container}>
      <Helmet title={'Register'} />
      <Grid
        container
        justify='center'
        alignItems='center'
        style={{ height: '80vh' }}
      >
        <Grid
          item
          lg={5}
          md={7}
          sm={9}
          xs={9}
          className={classes.gridContainer}
        >
          <div className={classes.mainContainer}>
            <Typography variant='h1'>Register</Typography>
            <form className={classes.formContainer} onSubmit={handleSubmit}>
              <TextField
                name='username'
                type='text'
                label='Username'
                variant='outlined'
                fullWidth
                error={Boolean(usernameError)}
                helperText={usernameError}
                value={username}
                onChange={usernameChange}
                className={classes.inputField}
              />
              <TextField
                name='email'
                type='email'
                label='Email'
                variant='outlined'
                fullWidth
                error={Boolean(emailError)}
                helperText={emailError}
                value={email}
                onChange={emailChange}
                className={classes.inputField}
              />
              <TextField
                name='password'
                type={showPassword ? 'text' : 'password'}
                label='Password'
                variant='outlined'
                fullWidth
                error={Boolean(passwordError)}
                helperText={passwordError}
                value={password}
                onChange={passwordChange}
                className={classes.inputField}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        style={{ padding: 8 }}
                        aria-label='toggle password visibility'
                        onClick={() => setShowPassword((prevVal) => !prevVal)}
                      >
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {error && (
                <Typography
                  variant='body2'
                  align='center'
                  className={classes.customError}
                >
                  {error}
                </Typography>
              )}
              {success && (
                <Typography
                  variant='body2'
                  align='center'
                  className={classes.infoMessage}
                >
                  {success.message}
                </Typography>
              )}

              <Button
                type='submit'
                variant='contained'
                color='primary'
                disabled={loading}
              >
                Signup
                {loading && <Loader button />}
              </Button>
            </form>
            <p className={classes.smallText}>
              Already have an account? <Link to='/signin'>Login</Link>
            </p>
          </div>
          <AuthFormPanel login />
        </Grid>
      </Grid>
    </div>
  );
};

export default Register;
