import { ReactNode } from 'react';
import { GroupsProvider } from '../Providers/GroupsProvider';
import { UserGroupMembershipProvider } from './UserGroupMembershipProvider';
import { UsersProvider } from './UsersProvider';
import { ClipsProvider } from './ClipsProvider';
import { LikesProvider } from './LikesProvider';
import { CommentsProvider } from './CommentsProvider';

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return (
    <UsersProvider>
      <UserGroupMembershipProvider>
        <GroupsProvider>
          <ClipsProvider>
            <CommentsProvider>
              <LikesProvider>{children}</LikesProvider>
            </CommentsProvider>
          </ClipsProvider>
        </GroupsProvider>
      </UserGroupMembershipProvider>
    </UsersProvider>
  );
};
