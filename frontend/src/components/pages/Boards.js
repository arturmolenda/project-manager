import React from 'react';

import { useSelector } from 'react-redux';

import { Container, Grid, Typography, makeStyles } from '@material-ui/core';
import GroupIcon from '@material-ui/icons/Group';
import PersonIcon from '@material-ui/icons/Person';

import BoardItem from '../boards/BoardItem';
import NewProjectBoard from '../boards/NewProjectBoard';
import Helmet from '../Helmet';

const useStyles = makeStyles(() => ({
  header: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 8,
    color: '#fff',
    '& svg': {
      marginRight: 10,
    },
  },
}));
const Boards = () => {
  const classes = useStyles();
  const {
    userInfo: { projectsJoined, projectsCreated, projectsThemes },
  } = useSelector((state) => state.userLogin);

  return (
    <Container style={{ margin: '8vh auto 2.5vh auto' }}>
      <Helmet title='Boards' />
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <div className={classes.header}>
            <PersonIcon />
            <Typography variant='h6'>Created Projects</Typography>
          </div>
        </Grid>
        {projectsCreated &&
          projectsCreated.map((project) => {
            return (
              <BoardItem
                key={project._id}
                project={project}
                projectsThemes={projectsThemes}
              />
            );
          })}
        <NewProjectBoard />

        {projectsJoined && projectsJoined.length > 0 && (
          <>
            <Grid item xs={12}>
              <div className={classes.header}>
                <GroupIcon />
                <Typography variant='h6'>Joined Projects</Typography>
              </div>
            </Grid>
            {projectsJoined.map((project) => {
              return (
                <BoardItem
                  key={project._id}
                  project={project}
                  projectsThemes={projectsThemes}
                />
              );
            })}
          </>
        )}
      </Grid>
    </Container>
  );
};

export default Boards;
