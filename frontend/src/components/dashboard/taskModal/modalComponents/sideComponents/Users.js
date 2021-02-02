import React from 'react';
import SideButton from './SideButton';
import PeopleIcon from '@material-ui/icons/People';

const Users = () => {
  return (
    <>
      <div>
        <SideButton icon={<PeopleIcon />} text='Users' />
      </div>
    </>
  );
};

export default Users;
