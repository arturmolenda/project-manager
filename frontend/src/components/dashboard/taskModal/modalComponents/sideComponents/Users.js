import React from 'react';
import SideButton from './SideButton';
import PeopleIcon from '@material-ui/icons/People';

const Users = () => {
  return (
    <>
      <SideButton icon={<PeopleIcon />} text='Users' />
    </>
  );
};

export default Users;
