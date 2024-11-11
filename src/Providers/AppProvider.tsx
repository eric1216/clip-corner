import { ReactNode } from 'react';
import { GroupsProvider } from '../Providers/GroupsProvider';
import { UserGroupMembershipProvider } from './UserGroupMembershipProvider';
import { UsersProvider } from './UsersProvider';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <UsersProvider>
      <UserGroupMembershipProvider>
        <GroupsProvider>{children}</GroupsProvider>
      </UserGroupMembershipProvider>
    </UsersProvider>
  );
};
