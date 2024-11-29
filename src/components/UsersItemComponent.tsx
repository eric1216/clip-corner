import { useGroups } from '../Providers/GroupsProvider';
import { useUserGroupMembership } from '../Providers/UserGroupMembershipProvider';
import { useUsers } from '../Providers/UsersProvider';
import '../css/user-item.css';

export function UserItemComponent() {
  const { users, areUsersLoading, usersError } = useUsers();
  const { activeGroup } = useGroups();
  const { memberships } = useUserGroupMembership();

  if (areUsersLoading) return 'Loading group users...';

  if (usersError) return 'Could not fetch group users: ' + usersError;

  const usersInGroup = memberships
    .filter((member) => member.group_id === activeGroup)
    .map((member) => member.user_id);

  const sortedUsers = users
    .filter((user) => usersInGroup.includes(user.id))
    .sort((a, b) => a.username.localeCompare(b.username));

  return (
    <>
      <h1 className='section-title'>Users</h1>
      {activeGroup ? (
        sortedUsers.map((user) => {
          return (
            <h3 className='user-item' key={user.id}>
              {user.username}
            </h3>
          );
        })
      ) : (
        <></>
      )}
    </>
  );
}
