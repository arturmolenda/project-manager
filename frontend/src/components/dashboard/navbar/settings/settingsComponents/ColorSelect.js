import React, { useState, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { updateColorTheme } from '../../../../../redux/actions/userActions';

import { makeStyles, Typography } from '@material-ui/core';
import FormatColorTextIcon from '@material-ui/icons/FormatColorText';

import { THEME_COLORS } from '../../../../../util/colorsContants';
import Header from './Header';

const useStyles = makeStyles(() => ({
  container: {
    margin: '0 40px',
    borderRadius: 5,
    overflow: 'hidden',
  },
  heading: {
    padding: 10,
    backgroundColor: '#cacaca',
    color: '#6f6f6f',
    '& h6': {
      textAlign: 'center',
      fontWeight: 600,
    },
  },
  colors: {
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
    padding: 5,
  },
  color: {
    margin: 5,
    borderRadius: 3,
    height: 30,
    width: 30,
    cursor: 'pointer',
    transition: '.1s ease',
    '&:hover': {
      transform: 'scale(1.2)',
    },
  },
}));

const ColorSelect = ({ colorTheme, projectId }) => {
  const dispatch = useDispatch();
  const [primaryColor, setPrimaryColor] = useState('#00bcd4');
  const classes = useStyles();

  useEffect(() => {
    if (colorTheme) setPrimaryColor(colorTheme);
  }, [colorTheme]);

  const clickHandle = (color) => {
    setPrimaryColor(color);
    dispatch(updateColorTheme(color, projectId));
  };
  return (
    <>
      <Header icon={FormatColorTextIcon} title='Color Theme' />
      <div className={classes.container}>
        <div className={classes.heading}>
          <Typography variant='subtitle2'>Select a Color</Typography>
        </div>
        <div className={classes.colors}>
          {THEME_COLORS.map((color, index) => (
            <div
              key={index}
              className={classes.color}
              style={{
                backgroundColor: color,
                transform: primaryColor === color && 'scale(1.2)',
              }}
              onClick={() => clickHandle(color)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ColorSelect;
