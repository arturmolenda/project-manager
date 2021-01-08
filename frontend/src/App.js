import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';

import {
  createMuiTheme,
  CssBaseline,
  LinearProgress,
  MuiThemeProvider,
} from '@material-ui/core';

import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Layout from './components/layout/Layout';
import ParticlesBackground from './components/ParticlesBackground';
import themeFile from './util/theme';
import Confirm from './components/pages/Confirm';
import Boards from './components/pages/Boards';
import Project from './components/pages/Project';
import { getUserData } from './redux/actions/userActions';

const theme = createMuiTheme(themeFile);

const PrivateRoute = ({ children, path, exact = false, userInfo }) => (
  <Route path={path} exact={exact}>
    {userInfo ? children : <Redirect to='/signin' />}
  </Route>
);

const App = () => {
  const { loading, userInfo } = useSelector((state) => state.userLogin);
  const dispatch = useDispatch({});
  useEffect(() => {
    if (userInfo && Object.keys(userInfo).length === 1)
      dispatch(getUserData(userInfo.token));
  }, [dispatch, userInfo]);
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
