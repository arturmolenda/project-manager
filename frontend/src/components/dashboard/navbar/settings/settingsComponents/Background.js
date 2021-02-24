import React from 'react';

import { makeStyles } from '@material-ui/core';
import PaletteIcon from '@material-ui/icons/Palette';

import Header from './Header';
import BackgroundSelect from './background/BackgroundSelect';

const useStyles = makeStyles(() => ({
  container: {
    marginBottom: 20,
  },
}));
const Background = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <Header icon={PaletteIcon} title='Background Theme' />
      <BackgroundSelect {...props} />
    </div>
  );
};

export default Background;
