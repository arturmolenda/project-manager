import React from 'react';

import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import { makeStyles, Typography } from '@material-ui/core';

import TitleUpdate from '../../lists/TitleUpdate';
import moment from 'moment';

const useStyles = makeStyles(() => ({
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
  },
  captionContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'baseline',
    width: '20%',
    wordBreak: 'break-word',
    paddingLeft: '8px',
  },
  caption: {
    color: '#979a9a',
  },
}));

const TaskHeader = ({ task }) => {
  const classes = useStyles();
  return (
    <div className={classes.textContainer}>
      <div className={classes.text}>
        <LabelImportantIcon color='primary' style={{ marginTop: 4 }} />
        <TitleUpdate
          currentTitle={task.title}
          projectId={task.projectId}
          taskId={task._id}
        />
      </div>

      <div className={classes.captionContainer}>
        <Typography variant='caption' className={classes.caption}>
          {moment(task.createdAt).format('MMMM Do YYYY')}
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
