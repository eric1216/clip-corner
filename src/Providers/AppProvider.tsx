import { ReactNode } from 'react';
import { GroupsProvider } from '../Providers/GroupsProvider';
import { UserGroupMembershipProvider } from './UserGroupMembershipProvider';
import { UsersProvider } from './UsersProvider';
import { ClipsProvider } from './ClipsProvider';
import { LikesProvider } from './LikesProvider';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <UsersProvider>
      <UserGroupMembershipProvider>
        <GroupsProvider>
          <ClipsProvider>
            <LikesProvider>{children}</LikesProvider>
          </ClipsProvider>
        </GroupsProvider>
      </UserGroupMembershipProvider>
    </UsersProvider>
  );
};
