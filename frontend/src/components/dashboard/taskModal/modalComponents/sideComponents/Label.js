import React from 'react';
import SideButton from './SideButton';
import LabelIcon from '@material-ui/icons/Label';

const Label = () => {
  return (
    <>
      <SideButton icon={<LabelIcon />} text='Label' />
    </>
  );
};

export default Label;
