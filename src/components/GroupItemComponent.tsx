import { useGroups } from '../Providers/GroupsProvider';
import { useUserGroupMembership } from '../Providers/UserGroupMembershipProvider';
import { useUsers } from '../Providers/UsersProvider';
import '../css/group-item.css';

export function GroupItemComponent() {
  const { groups, areGroupsLoading, groupsError, activeGroup, setActiveGroup } = useGroups();
  const { memberships } = useUserGroupMembership();
  const { activeUser } = useUsers();

  if (areGroupsLoading) return 'Loading...';

  if (groupsError) return 'Could not fetch groups: ' + groupsError;

  const groupsUserIsIn = memberships
    .filter((membership) => membership.user_id === activeUser?.id)
    .map((membership) => membership.group_id);

  const sortedGroups = groups
    .filter((group) => groupsUserIsIn.includes(group.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <h1 className='section-title'>Corners</h1>
      {sortedGroups.map((group) => {
        const isActive = group.id === activeGroup;
        return (
          <h3
            className={`group-item ${isActive ? 'active-group' : ''}`}
            key={group.id}
            onClick={() => {
              setActiveGroup(group.id);
              localStorage.setItem('activeGroup', group.id);
            }}
          >
            {group.name}
          </h3>
        );
      })}
    </>
  );
}
