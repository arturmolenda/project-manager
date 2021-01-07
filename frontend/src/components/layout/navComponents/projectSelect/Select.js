import React, { Fragment } from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import FolderIcon from '@material-ui/icons/Folder';
import { makeStyles, Typography, Tooltip } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '2px solid #b2c2f1 ',
    borderRadius: 4,
    height: 40,
    cursor: 'pointer',
    margin: '0 14px',
    transition: 'border .25s ease-out',
    '&:hover': {
      border: '2px solid #fff',
    },
    '& svg': {
      marginRight: 5,
    },
  },
  innerContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '85%',
  },
  text: {
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  folderIcon: {
    fontSize: 20,
    margin: '0 5px',
  },
  arrowMargin: {
    margin: '0 !important',
  },
}));

const SelectItem = ({ anchorEl, setAnchorEl, title, navExpanded }) => {
  const classes = useStyles();
  return (
    <div
      className={classes.container}
      onClick={(e) => setAnchorEl(e.currentTarget)}
      style={{
        border: anchorEl && '2px solid #fff',
        display: !navExpanded && 'inline-flex',
      }}
    >
      <Fragment>
        <div
          className={classes.innerContainer}
          style={{ display: !navExpanded && 'none' }}
        >
          <FolderIcon className={classes.folderIcon} />
          <Typography variant='subtitle2' className={classes.text}>
            {title ? title : 'Select Project'}
          </Typography>
        </div>
        {anchorEl ? (
          <ArrowDropUpIcon
            className={!navExpanded ? classes.arrowMargin : ''}
          />
        ) : (
          <ArrowDropDownIcon
            className={!navExpanded ? classes.arrowMargin : ''}
          />
        )}
      </Fragment>
    </div>
  );
};

export default SelectItem;
