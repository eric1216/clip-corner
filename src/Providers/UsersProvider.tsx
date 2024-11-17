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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TUsers } from '../types';

type TUsersContext = {
  users: TUsers[];
  areUsersLoading: boolean;
  usersError: unknown;
  loginStatus: boolean;
  createUser: (newUser: Partial<TUsers>) => void;
  setLoginStatus: Dispatch<SetStateAction<boolean>>;
  activeUser: { id: string; username: string } | null;
  setActiveUser: Dispatch<SetStateAction<{ id: string; username: string } | null>>;
  isUsernameUnique: (input: string) => boolean;
  doesUserPasswordMatch: (usernameInput: string, passwordInput: string) => boolean;
  setUserCredentials: (usernameInput: string, passwordInput: string) => void;
};

const UsersContext = createContext<TUsersContext>({} as TUsersContext);

export function UsersProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [loginStatus, setLoginStatus] = useState(false);
  const [activeUser, setActiveUser] = useState<{ id: string; username: string } | null>(null);

  const {
    data: users = [],
    isLoading: areUsersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => Requests.fetchData('users'),
  });

  const createUser = useMutation({
    mutationFn: (newUser: Partial<TUsers>) => {
      return Requests.postItem('users', newUser);
    },
    onSuccess: (data) => {
      const userData = { id: data.id, username: data.username };
      setActiveUser(userData);
      localStorage.setItem('activeUser', JSON.stringify(userData));
      setLoginStatus(true);
      queryClient.refetchQueries({ queryKey: ['users'] });
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('activeUser');
    if (storedUser) {
      setActiveUser(JSON.parse(storedUser));
      setLoginStatus(true);
    } else {
      setActiveUser(null);
      setLoginStatus(false);
    }
  }, [loginStatus]);

  const isUsernameUnique = (input: string) => {
    return !users.some((user: TUsers) => user.username === input);
  };

  const doesUserPasswordMatch = (usernameInput: string, passwordInput: string) => {
    return users.some(
      (user: TUsers) => user.username === usernameInput && user.password === passwordInput
    );
  };

  const setUserCredentials = (usernameInput: string, passwordInput: string) => {
    const user = users.find(
      (user: TUsers) => user.username === usernameInput && user.password === passwordInput
    );
    if (user) {
      setActiveUser({ id: user.id, username: user.username });
      localStorage.setItem('activeUser', JSON.stringify({ id: user.id, username: user.username }));
    } else {
      console.error('User not found or invalid credentials');
      setActiveUser(null);
      localStorage.removeItem('activeUser');
    }
  };

  return (
    <UsersContext.Provider
      value={{
        users,
        areUsersLoading,
        usersError,
        loginStatus,
        createUser: createUser.mutate,
        setLoginStatus,
        activeUser,
        setActiveUser,
        isUsernameUnique,
        doesUserPasswordMatch,
        setUserCredentials,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUsers = () => useContext(UsersContext);
