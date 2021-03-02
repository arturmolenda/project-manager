import React, { useState } from 'react';

import PersonAddIcon from '@material-ui/icons/PersonAdd';

import AddUserMenu from './AddUserMenu';
import NavItem from '../../../layout/navComponents/NavItem';

const InviteUsers = ({ navExpanded, mobile }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <>
      <NavItem
        action={(e) => setAnchorEl(e.currentTarget)}
        navExpanded={navExpanded}
        mobile={mobile}
        title={'Invite Users'}
        Icon={PersonAddIcon}
      />
      <AddUserMenu handleClose={() => setAnchorEl(null)} anchorEl={anchorEl} />
    </>
  );
};

export default InviteUsers;
