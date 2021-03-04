import React from 'react';

import { makeStyles, Typography } from '@material-ui/core';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';

import TitleUpdate from '../../lists/TitleUpdate';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
  textContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    '& > div > svg': {
      marginRight: 15,
    },
  },
  text: {
    display: 'flex',
    width: '80%',
    wordBreak: 'break-word',
    alignItems: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      marginRight: 8,
    },
  },
  captionContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'baseline',
    width: '20%',
    wordBreak: 'break-word',
    paddingLeft: '8px',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: 0,
    },
  },

  caption: {
    color: '#979a9a',
  },
}));

const TaskHeader = ({ task, disabled }) => {
  const classes = useStyles();
  return (
    <div className={classes.textContainer}>
      <div className={classes.text}>
        <LabelImportantIcon color='primary' style={{ marginTop: 4 }} />
        <TitleUpdate
          currentTitle={task.title}
          projectId={task.projectId}
          taskId={task._id}
          disabled={disabled}
        />
      </div>

      <div className={classes.captionContainer}>
        <Typography variant='caption' className={classes.caption}>
          {moment(task.createdAt).format('MMM Do YYYY')}
        </Typography>
        <Typography variant='caption' className={classes.caption}>
          <Typography variant='caption' color='primary'>
            {task.author}
          </Typography>
        </Typography>
      </div>
    </div>
  );
};

export default TaskHeader;
