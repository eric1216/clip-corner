import { useGroups } from '../Providers/GroupsProvider';
import { useUserGroupMembership } from '../Providers/UserGroupMembershipProvider';
import { useUsers } from '../Providers/UsersProvider';
import '../css/group-item.css';

export function GroupItemComponent() {
  const { groups, areGroupsLoading, groupsError, activeGroup, changeActiveGroup } = useGroups();
  const { memberships } = useUserGroupMembership();
  const { activeUser } = useUsers();

  if (areGroupsLoading) return 'Loading...';

  if (groupsError) return 'Could not fetch groups: ' + groupsError;

  const userGroupIds = memberships
    ?.filter((membership) => membership.user_id === activeUser?.id)
    .map((membership) => membership.group_id);

  return (
    <>
      {groups
        ?.filter((group) => userGroupIds.includes(group.id))
        .map((group) => {
          const isActive = group.id === activeGroup;
          return (
            <h3
              className={`group-item ${isActive ? 'active-group' : ''}`}
              key={group.id}
              onClick={() => changeActiveGroup(group.id)}
            >
              {group.name}
            </h3>
          );
        })}
    </>
  );
}
