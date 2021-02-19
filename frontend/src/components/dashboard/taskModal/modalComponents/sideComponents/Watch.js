import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { updateTaskWatch } from '../../../../../redux/actions/projectActions';

import VisibilityIcon from '@material-ui/icons/Visibility';

import SideButton from './SideButton';

const Watch = ({ usersWatching, taskId, taskIndex, listIndex }) => {
  const {
    userInfo: { _id: userId },
  } = useSelector((state) => state.userLogin);
  const dispatch = useDispatch();

  const isWatching = usersWatching.includes(userId);

  const updateWatchHandle = () => {
    dispatch(updateTaskWatch(taskId, userId, isWatching, taskIndex, listIndex));
  };

  return (
    <SideButton
      icon={<VisibilityIcon />}
      text='Watch'
      clickHandle={updateWatchHandle}
      styleProps={
        isWatching && { background: '#b5e7ee', border: '1px solid #00bcd4' }
      }
    />
  );
};

export default Watch;
