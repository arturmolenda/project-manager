import React from 'react';
import SideButton from './SideButton';
import LabelIcon from '@material-ui/icons/Label';

const Label = () => {
  return (
    <>
      <div>
        <SideButton icon={<LabelIcon />} text='Label' />
      </div>
    </>
  );
};

export default Label;
