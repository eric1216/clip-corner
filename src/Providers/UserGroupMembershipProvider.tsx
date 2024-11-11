import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, ReactNode, useContext } from 'react';
import { TUserGroupMembership } from '../types';
import { Requests } from '../api';
import { useUsers } from './UsersProvider';

type TUserGroupMembershipContext = {
  memberships: TUserGroupMembership[];
  areMembershipsLoading: boolean;
  membershipsError: unknown;
  generateUserMembership: (newMembership: Partial<TUserGroupMembership>) => void;
  checkForExistingMembership: (user_id: string, group_id: string) => boolean;
};

const UserGroupMembershipContext = createContext<TUserGroupMembershipContext>(
  {} as TUserGroupMembershipContext
);

export const UserGroupMembershipProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { loginStatus } = useUsers();

  const {
    data: memberships = [],
    isLoading: areMembershipsLoading,
    error: membershipsError,
  } = useQuery({
    queryKey: ['userGroupMembership'],
    queryFn: () => Requests.fetchData(`userGroupMembership`),
    enabled: loginStatus,
  });

  const generateUserMembership = useMutation({
    mutationFn: (newMembership: Partial<TUserGroupMembership>) => {
      return Requests.postItem('userGroupMembership', newMembership);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['userGroupMembership'] });
      queryClient.refetchQueries({ queryKey: ['groups'] });
    },
  });

  const checkForExistingMembership = (user_id: string, group_id: string) => {
    return memberships.some(
      (member: TUserGroupMembership) => member.user_id === user_id && member.group_id === group_id
    );
  };

  return (
    <UserGroupMembershipContext.Provider
      value={{
        memberships,
        areMembershipsLoading,
        membershipsError,
        generateUserMembership: generateUserMembership.mutate,
        checkForExistingMembership,
      }}
    >
      {children}
    </UserGroupMembershipContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUserGroupMembership = () => useContext(UserGroupMembershipContext);
