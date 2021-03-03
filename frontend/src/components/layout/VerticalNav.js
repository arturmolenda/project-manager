import React, { useState, useEffect, useRef } from 'react';

import { useSelector } from 'react-redux';

import { makeStyles, IconButton } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import NavLinks from './navComponents/NavLinks';

const useStyles = makeStyles(() => ({
  verticalNavbar: {
    display: 'flex',
    position: 'fixed',
    top: 0,
    flexDirection: 'column',
    justifyContent: 'baseline',
    height: '100vh',
    width: '15rem',
    backgroundColor: '#4e73df',
    backgroundImage:
      'linear-gradient(0deg, rgb(0, 23, 67) 0%, rgb(20, 116, 172) 100%)',
    backgroundSize: 'cover',
    zIndex: 12,
    color: '#fff',
    borderTopRightRadius: 15,
    transition: '.2s ease',
  },
  innerContainer: {
    position: 'relative',
    paddingBottom: 58,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    transition: 'all .2s',
    marginTop: 10,
  },
  arrowButton: {
    width: 48,
    color: '#fff',
    transition: 'background .2s',
  },
  arrowIcon: {
    transition: '.2s ease',
  },
  mobileBackdrop: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.20)',
    zIndex: 111,
  },
}));

const VerticalNav = () => {
  const [navExpanded, setNavExpanded] = useState(true);
  const [prepareToHide, setPrepareToHide] = useState(true);
  const [mobile, setMobile] = useState(false);
  const { loading } = useSelector((state) => state.userLogin);
  const navbarRef = useRef();
  const classes = useStyles();

  const handleWindowSizeChange = () => {
    if (window.innerWidth <= 768) {
      setNavExpanded(false);
      setPrepareToHide(false);
      setMobile(true);
    } else if (window.innerWidth > 768) setMobile(false);
  };

  useEffect(() => {
    handleWindowSizeChange();
    window.addEventListener('resize', handleWindowSizeChange);
  }, []);

  const expandHandle = () => {
    setPrepareToHide((prev) => !prev);
    if (!mobile) {
      setNavExpanded((prev) => !prev);
    } else if (navExpanded && mobile) {
      navbarRef.current.style.width = 0;
      navbarRef.current.style.marginRight = 0;
      setTimeout(() => {
        setNavExpanded(false);
      }, 200);
    } else {
      setNavExpanded(true);
    }
  };

  return (
    <>
      <div style={{ background: 'transparent', zIndex: 112 }}>
        <div
          ref={navbarRef}
          className={classes.verticalNavbar}
          style={{
            width: navExpanded ? '13.5rem' : mobile ? 0 : 56,
          }}
        >
          <NavLinks
            navExpanded={mobile ? prepareToHide : navExpanded}
            mobile={mobile}
            closeNav={() => mobile && navExpanded && expandHandle()}
          />
          {!loading && (
            <div
              className={classes.buttonContainer}
              style={{ marginLeft: !navExpanded && mobile && 5 }}
            >
              <IconButton
                className={classes.arrowButton}
                onClick={expandHandle}
              >
                <ArrowForwardIosIcon
                  className={classes.arrowIcon}
                  color={!navExpanded && mobile ? 'primary' : 'inherit'}
                  style={{
                    color: navExpanded && '#fff',
                    transform: navExpanded ? 'rotate(-180deg)' : 'rotate(0deg)',
                  }}
                />
              </IconButton>
            </div>
          )}
        </div>
        {/* Fix to use position: fixed and keep navbar's space */}
        {!mobile && (
          <div
            style={{
              width: navExpanded ? '13.5rem' : mobile ? 48 : 56,
              visibility: 'hidden',
              transition: '.2s ease',
            }}
          >
            <NavLinks navExpanded={navExpanded} mobile={mobile} />
          </div>
        )}
      </div>
      {mobile && navExpanded && (
        <div
          className={classes.mobileBackdrop}
          onClick={navExpanded && mobile && expandHandle}
        />
      )}
    </>
  );
};

export default VerticalNav;
