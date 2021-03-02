import React, { useState } from 'react';

import Menu from './menu/Menu';
import Select from './menu/Select';

const ProjectSelect = ({ navExpanded, mobile }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  return (
    <div
      style={{
        visibility: !navExpanded && mobile && 'hidden',
        margin: '5px 0',
      }}
    >
      <Select
        setAnchorEl={setAnchorEl}
        anchorEl={anchorEl}
        navExpanded={navExpanded}
      />
      <Menu anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
    </div>
  );
};

export default ProjectSelect;
