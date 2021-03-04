import React, { useState, useEffect, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  updateProjectBgColor,
  uploadProjectBgImage,
} from '../../../../../../redux/actions/userActions';

import { Typography, makeStyles, Button } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

import ImageUpload from './ImageUpload';
import { BACKGROUND_COLORS } from '../../../../../../util/colorsContants';
import Loader from '../../../../../Loader';

const useStyles = makeStyles(() => ({
  container: {
    margin: '0 40px',
    borderRadius: 5,
    overflow: 'hidden',
  },
  heading: {
    display: 'flex',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#cacaca',
    color: '#6f6f6f',
    '& h6': {
      fontWeight: 600,
    },
  },
  colors: {
    height: 'auto',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    padding: 5,
  },
  color: {
    display: 'flex',
    margin: 5,
    borderRadius: 3,
    height: 30,
    width: '100%',
    cursor: 'pointer',
    transition: '.1s ease',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  backgroundPreview: {
    position: 'relative',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  btnContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: 10,
  },
  loadingProgress: {
    position: 'absolute',
  },
}));

const BackgroundSelect = ({ backgroundTheme, open, projectId }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.userProjectBgUpdate);
  const [formData, setFormData] = useState(null);
  const [background, setBackground] = useState(null);
  const [previewHeight, setPreviewHeight] = useState(0);
  const imageSelectRef = useRef();
  const backgroundRef = useRef();
  const classes = useStyles();

  // calculate background preview height
  const calculatePreviewHeight = () => {
    if (backgroundRef.current) {
      const ratio = window.innerWidth / backgroundRef.current.scrollWidth;
      setPreviewHeight(window.innerHeight / ratio);
    }
  };

  useEffect(() => {
    calculatePreviewHeight();
    window.addEventListener('resize', calculatePreviewHeight);
  }, []);

  useEffect(() => {
    if (backgroundTheme && open) setBackground(backgroundTheme);
    if (!open) {
      setTimeout(() => {
        setFormData(false);
        setBackground(backgroundTheme);
      }, 200);
    }
  }, [backgroundTheme, open]);

  const selectBackgroundColor = (color) => {
    setBackground(color);
    setFormData(null);
    imageSelectRef.current.value = '';
  };

  const saveHandle = () => {
    if (background && !formData) {
      dispatch(updateProjectBgColor(background, projectId));
    } else {
      dispatch(uploadProjectBgImage(formData, projectId));
    }
  };

  return (
    <div className={classes.container}>
      <div
        className={classes.heading}
        style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        <Typography variant='subtitle2'>Select a Background</Typography>
      </div>
      <div className={classes.colors}>
        {BACKGROUND_COLORS.map((color, index) => (
          <div
            key={index}
            className={classes.color}
            style={{
              background: color,
              transform: background === color && 'scale(1.1)',
              margin: background === color && '5px 7px',
            }}
            onClick={() => selectBackgroundColor(color)}
          />
        ))}
      </div>
      <div style={{ width: '100%' }}>
        <div className={classes.heading} style={{ justifyContent: 'center' }}>
          <Typography variant='subtitle2'>Or upload your image</Typography>
        </div>
        <div
          className={classes.backgroundPreview}
          ref={backgroundRef}
          style={{
            height: previewHeight,
            backgroundImage: background
              ? background.startsWith('linear')
                ? background
                : `url(${background})`
              : '#fff',
          }}
        >
          <ImageUpload
            background={background}
            setBackground={setBackground}
            disabled={loading}
            setFormData={setFormData}
            imageSelectRef={imageSelectRef}
          />
        </div>
        <div className={classes.btnContainer}>
          <Button
            variant='contained'
            onClick={saveHandle}
            color='primary'
            style={{ width: '30%' }}
            disabled={loading}
          >
            Save
            {loading && <Loader button />}
          </Button>
        </div>
        {error && (
          <Alert severity='error' style={{ marginTop: 10 }}>
            Something went wrong, try again later
          </Alert>
        )}
      </div>
    </div>
  );
};

export default BackgroundSelect;
