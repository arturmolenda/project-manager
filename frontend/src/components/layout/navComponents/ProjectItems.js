import React from 'react';

import { useSelector } from 'react-redux';

import ArchivedTasks from '../../dashboard/navbar/archivedTasks/ArchivedTasks';
import Chat from '../../dashboard/navbar/groupChat/Chat';
import InviteUsers from '../../dashboard/navbar/inviteUsers/InviteUsers';
import Settings from '../../dashboard/navbar/settings/Settings';
import Users from '../../dashboard/navbar/users/Users';

const ProjectItems = ({ navExpanded, mobile }) => {
  const { loading, project } = useSelector((state) => state.projectGetData);
  const visibility = !navExpanded && mobile ? 'hidden' : 'visible';
  return (
    <>
      {!loading && project && Object.keys(project).length > 0 && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <Chat visibility={visibility} />
            {navExpanded && (
              <>
                <ArchivedTasks />
                <Settings />
              </>
            )}
          </div>
          <div style={{ visibility }}>
            <Users maxUsers={navExpanded ? 6 : 0} />
            <InviteUsers navExpanded={navExpanded} mobile={mobile} />
          </div>
        </>
      )}
    </>
  );
};

export default ProjectItems;
