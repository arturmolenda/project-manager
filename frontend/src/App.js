import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import {
  getUpdatedNotifications,
  getUserData,
  logout,
} from './redux/actions/userActions';
import {
  USER_DATA_UPDATE,
  USER_REMOVED,
} from './redux/constants/userConstants';

import {
  unstable_createMuiStrictModeTheme as createMuiTheme,
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
import ProjectJoinPage from './components/pages/ProjectJoinPage';
import NotFoundPage from './components/pages/NotFoundPage';

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
    if (socket) {
      socket.on('notifications-updated', () =>
        dispatch(getUpdatedNotifications())
      );
      socket.on('user-updated', (data) =>
        dispatch({ type: USER_DATA_UPDATE, payload: data })
      );
      socket.on('auth-error', () => dispatch(logout()));
      socket.on('user-removed-from-project', (data) =>
        dispatch({ type: USER_REMOVED, payload: data })
      );
    }
  }, [dispatch, socket]);
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          {loading && userInfo && userInfo.token ? (
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
                <PrivateRoute
                  exact
                  path='/project/:id/:taskId?'
                  userInfo={userInfo}
                >
                  <Project />
                </PrivateRoute>
                <PrivateRoute
                  exact
                  path='/invite/:projectId/:joinId'
                  userInfo={userInfo}
                >
                  <ProjectJoinPage />
                </PrivateRoute>
                <Route exact path='*'>
                  <ParticlesBackground />
                  <NotFoundPage />
                </Route>
              </Switch>
            </>
          )}
        </Layout>
      </Router>
    </MuiThemeProvider>
  );
};

export default App;
