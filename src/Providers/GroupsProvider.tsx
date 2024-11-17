import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Requests } from '../api';
import { TGroups } from '../types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUserGroupMembership } from './UserGroupMembershipProvider';
import { useUsers } from './UsersProvider';

type TGroupsContext = {
  groups: TGroups[];
  areGroupsLoading: boolean;
  groupsError: unknown;
  postGroup: (newGroup: Partial<TGroups>) => void;
  activeGroup: string;
  setActiveGroup: Dispatch<SetStateAction<string>>;
  showGroupFormPage: boolean;
  setShowGroupFormPage: Dispatch<SetStateAction<boolean>>;
  doesGroupExist: (groupName: string) => boolean;
  isGroupPasswordCorrect: (groupName: string, groupPassword: string) => boolean;
  isUserAlreadyMember: (groupName: string) => boolean;
  addUserToGroup: (groupName: string) => void;
  leaveGroup: (groupId: string) => void;
};

const GroupsContext = createContext<TGroupsContext>({} as TGroupsContext);

export const GroupsProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { memberships, generateUserMembership, checkForExistingMembership } =
    useUserGroupMembership();
  const { activeUser, loginStatus } = useUsers();
  const [activeGroup, setActiveGroup] = useState<string>('');
  const [showGroupFormPage, setShowGroupFormPage] = useState<boolean>(false);

  const {
    data: groups = [],
    isLoading: areGroupsLoading,
    error: groupsError,
  } = useQuery({
    queryKey: ['groups'],
    queryFn: () => Requests.fetchData('groups'),
    enabled: loginStatus,
  });

  const postGroup = useMutation({
    mutationFn: (newGroup: Partial<TGroups>) => {
      return Requests.postItem('groups', newGroup);
    },
    onSuccess: (data) => {
      generateUserMembership({ user_id: activeUser?.id, group_id: data.id });
      setActiveGroup(data.id);
      localStorage.setItem('activeGroup', data.id);
      queryClient.refetchQueries({ queryKey: ['userGroupMembership'] });
      queryClient.refetchQueries({ queryKey: ['groups'] });
    },
  });

  const leaveGroup = useMutation({
    mutationFn: (groupId: string) => {
      const membershipIdToLRemove = memberships.find(
        (membership) => membership.group_id === groupId && membership.user_id === activeUser!.id
      );
      return Requests.deleteItem('userGroupMembership', membershipIdToLRemove!.id);
    },
    onSuccess: () => {
      setActiveGroup('');
      localStorage.removeItem('activeGroup');
      queryClient.refetchQueries({ queryKey: ['userGroupMembership'] });
    },
  });

  useEffect(() => {
    if (areGroupsLoading) return;

    const storedGroupId = localStorage.getItem('activeGroup');

    const getFirstEligibleGroupId = () => {
      return (
        groups
          .filter((group: TGroups) =>
            memberships.some(
              (membership) =>
                membership.user_id === activeUser?.id && membership.group_id === group.id
            )
          )
          .sort((a: TGroups, b: TGroups) => a.name.localeCompare(b.name))
          .map((group: TGroups) => group.id)[0] || null
      );
    };

    const activeGroupId = storedGroupId || getFirstEligibleGroupId();

    if (activeGroupId) {
      setActiveGroup(activeGroupId);
      if (!storedGroupId) localStorage.setItem('activeGroup', activeGroupId);
    }
  }, [memberships, groups, setActiveGroup, areGroupsLoading, activeUser?.id]);

  const doesGroupExist = (groupName: string) => {
    return groups.some((group: TGroups) => group.name === groupName);
  };

  const isGroupPasswordCorrect = (groupName: string, groupPassword: string) => {
    return groups.some(
      (group: TGroups) => group.name === groupName && group.group_password === groupPassword
    );
  };

  const isUserAlreadyMember = (groupName: string) => {
    const matchingGroup = groups.find((group: TGroups) => group.name === groupName);
    return checkForExistingMembership(activeUser!.id, matchingGroup?.id);
  };

  const addUserToGroup = (groupName: string) => {
    const matchingGroup = groups.find((group: TGroups) => group.name === groupName);
    generateUserMembership({ user_id: activeUser?.id, group_id: matchingGroup?.id });
    setActiveGroup(matchingGroup.id);
    localStorage.setItem('activeGroup', matchingGroup.id);
  };

  return (
    <GroupsContext.Provider
      value={{
        groups,
        areGroupsLoading,
        groupsError,
        postGroup: postGroup.mutate,
        activeGroup,
        setActiveGroup,
        showGroupFormPage,
        setShowGroupFormPage,
        doesGroupExist,
        isGroupPasswordCorrect,
        isUserAlreadyMember,
        addUserToGroup,
        leaveGroup: leaveGroup.mutate,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGroups = () => useContext(GroupsContext);
