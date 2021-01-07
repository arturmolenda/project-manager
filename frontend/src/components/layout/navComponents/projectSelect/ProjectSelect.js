import React, { useState } from 'react';

import Menu from './Menu';
import Select from './Select';

const ProjectSelect = ({ navExpanded, mobile }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [projects, setProjects] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [title, setTitle] = useState('');

  return (
    <div style={{ visibility: !navExpanded && mobile && 'hidden' }}>
      <Select
        setAnchorEl={setAnchorEl}
        anchorEl={anchorEl}
        title={title}
        navExpanded={navExpanded}
      />
      <Menu
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        projects={projects}
        currentProject={currentProject}
      />
    </div>
  );
};

export default ProjectSelect;
