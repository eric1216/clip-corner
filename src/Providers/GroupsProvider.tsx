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
  changeActiveGroup: (groupId: string) => void;
  showGroupFormPage: boolean;
  setShowGroupFormPage: Dispatch<SetStateAction<boolean>>;
  doesGroupExist: (groupName: string) => boolean;
  isGroupPasswordCorrect: (groupName: string, groupPassword: string) => boolean;
  isUserAlreadyMember: (groupName: string) => boolean;
  addUserToGroup: (groupName: string) => void;
};

const GroupsContext = createContext<TGroupsContext>({} as TGroupsContext);

export const GroupsProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const { generateUserMembership, checkForExistingMembership } = useUserGroupMembership();
  const { activeUser, loginStatus } = useUsers();
  const [activeGroup, setActiveGroup] = useState<string>('');
  const [showGroupFormPage, setShowGroupFormPage] = useState<boolean>(false);

  const changeActiveGroup = (groupId: string) => {
    setActiveGroup(groupId);
    localStorage.setItem('activeGroup', groupId);
  };

  const {
    data: groups = [],
    isLoading: areGroupsLoading,
    error: groupsError,
  } = useQuery({
    queryKey: ['groups'],
    queryFn: () => Requests.fetchData('groups'),
    enabled: loginStatus,
  });

  useEffect(() => {
    if (!areGroupsLoading) {
      const storedGroupId = localStorage.getItem('activeGroup');
      if (storedGroupId) {
        setActiveGroup(storedGroupId);
      } else if (groups.length > 0) {
        setActiveGroup(groups[0].id);
      }
    }
  }, [areGroupsLoading, groups]);

  const postGroup = useMutation({
    mutationFn: (newGroup: Partial<TGroups>) => {
      return Requests.postItem('groups', newGroup);
    },
    onSuccess: (data) => {
      generateUserMembership({ user_id: activeUser?.id, group_id: data.id });
      changeActiveGroup(data.id);
      queryClient.refetchQueries({ queryKey: ['userGroupMembership'] });
      queryClient.refetchQueries({ queryKey: ['groups'] });
    },
  });

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
    changeActiveGroup(matchingGroup.id);
  };

  return (
    <GroupsContext.Provider
      value={{
        groups,
        areGroupsLoading,
        groupsError,
        postGroup: postGroup.mutate,
        activeGroup,
        changeActiveGroup,
        showGroupFormPage,
        setShowGroupFormPage,
        doesGroupExist,
        isGroupPasswordCorrect,
        isUserAlreadyMember,
        addUserToGroup,
      }}
    >
      {children}
    </GroupsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGroups = () => useContext(GroupsContext);
