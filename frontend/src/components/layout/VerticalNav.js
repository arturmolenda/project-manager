import React, { useState, useEffect, useRef } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import NavLinks from './navComponents/NavLinks';

const useStyles = makeStyles(() => ({
  verticalNavbar: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'baseline',
    height: '100vh',
    width: '15rem',
    backgroundColor: '#4e73df',
    backgroundImage: 'linear-gradient(180deg,#4e73df 10%,#224abe)',
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
    position: 'absolute',
    right: 0,
    transition: 'all .2s',
    marginTop: 10,
  },
  buttonMobile: {
    margin: '10px 15px',
    borderRadius: '50%',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
  },
  arrowButton: {
    width: 48,
    color: '#fff',
    transition: 'background .2s',
  },
  arrowIcon: {
    transition: '.2s ease',
  },
}));

const VerticalNav = () => {
  const [navExpanded, setNavExpanded] = useState(true);
  const [mobile, setMobile] = useState(false);
  const navbarRef = useRef();
  const classes = useStyles();

  const handleWindowSizeChange = () => {
    if (window.innerWidth <= 768) {
      setNavExpanded(false);
      setMobile(true);
    } else if (window.innerWidth > 768) setMobile(false);
  };

  useEffect(() => {
    handleWindowSizeChange();
    window.addEventListener('resize', handleWindowSizeChange);
  }, []);

  const expandHandle = () => {
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
    <div style={{ background: 'transparent' }}>
      <div
        ref={navbarRef}
        className={classes.verticalNavbar}
        style={{
          width: navExpanded ? '13.5rem' : mobile ? 48 : 56,
          position: mobile ? 'absolute' : 'initial',
          background: navExpanded
            ? 'linear-gradient(0deg, rgb(0, 23, 67) 0%, rgb(20, 116, 172) 100%)'
            : mobile
            ? 'none'
            : 'linear-gradient(0deg, rgb(0, 23, 67) 0%, rgb(20, 116, 172) 100%)',
        }}
      >
        <div className={classes.innerContainer}>
          <div
            className={`${classes.buttonContainer} ${
              mobile && classes.buttonMobile
            }`}
            style={{
              margin: navExpanded && !mobile && '10px 15px 0 0',
              right: navExpanded ? '0px' : 'calc(50% - 24px)',
            }}
          >
            <IconButton className={classes.arrowButton} onClick={expandHandle}>
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
        </div>
        <NavLinks navExpanded={navExpanded} mobile={mobile} />
      </div>
    </div>
  );
};

export default VerticalNav;
