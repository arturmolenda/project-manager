import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { getUserData, logout } from './redux/actions/userActions';

import {
  createMuiTheme,
  CssBaseline,
  LinearProgress,
  MuiThemeProvider,
} from '@material-ui/core';

import themeFile from './util/theme';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Layout from './components/layout/Layout';
import ParticlesBackground from './components/ParticlesBackground';
import Confirm from './components/pages/Confirm';
import Boards from './components/pages/Boards';
import Project from './components/pages/Project';

const theme = createMuiTheme(themeFile);

const PrivateRoute = ({ children, path, exact = false, userInfo }) => (
  <Route path={path} exact={exact}>
    {userInfo ? children : <Redirect to='/signin' />}
  </Route>
);

const App = () => {
  const { loading, userInfo } = useSelector((state) => state.userLogin);
  const { socket } = useSelector((state) => state.socketConnection);
  const dispatch = useDispatch({});
  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length === 1)
      dispatch(getUserData(userInfo.token));
  }, [dispatch, userInfo]);

  useEffect(() => {
    if (socket) socket.on('auth-error', () => dispatch(logout()));
  }, [dispatch, socket]);
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          {loading ? (
            <>
              <LinearProgress
                style={{
                  position: 'absolute',
                  left: 0,
                  width: '100%',
                }}
              />
            </>
          ) : (
            <>
              <Switch>
                <Route exact path='/'>
                  <ParticlesBackground />
                  <Home />
                </Route>
                <Route exact path='/signin'>
                  <ParticlesBackground />
                  <Login />
                </Route>
                <Route exact path='/register'>
                  <ParticlesBackground />
                  <Register />
                </Route>
                <Route exact path='/confirm/:id'>
                  <ParticlesBackground />
                  <Confirm />
                </Route>
                <PrivateRoute exact path='/boards' userInfo={userInfo}>
                  <ParticlesBackground />
                  <Boards />
                </PrivateRoute>
                <PrivateRoute exact path='/project/:id' userInfo={userInfo}>
                  <Project />
                </PrivateRoute>
              </Switch>
            </>
          )}
        </Layout>
      </Router>
    </MuiThemeProvider>
  );
};

export default App;
