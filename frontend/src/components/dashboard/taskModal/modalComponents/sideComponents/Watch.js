import React from 'react';

import VisibilityIcon from '@material-ui/icons/Visibility';

import SideButton from './SideButton';

const Watch = () => {
  return (
    <>
      <SideButton icon={<VisibilityIcon />} text='Watch' />
    </>
  );
};

export default Watch;
