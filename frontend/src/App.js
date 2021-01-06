import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import {
  createMuiTheme,
  CssBaseline,
  MuiThemeProvider,
} from '@material-ui/core';

import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import Layout from './components/layout/Layout';
import ParticlesBackground from './components/ParticlesBackground';
import themeFile from './util/theme';

const theme = createMuiTheme(themeFile);

const App = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
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
          </Switch>
        </Layout>
      </Router>
    </MuiThemeProvider>
  );
};

export default App;
