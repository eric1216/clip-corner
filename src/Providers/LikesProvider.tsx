import { createContext, ReactNode, useContext } from 'react';
import { TLikes } from '../types';
import { Requests } from '../api';
import { useQuery } from '@tanstack/react-query';

type TLikesContext = {
  likes: TLikes[];
  areLikesLoading: boolean;
  likesError: unknown;
};

const LikesContext = createContext<TLikesContext>({} as TLikesContext);

export function LikesProvider({ children }: { children: ReactNode }) {
  const {
    data: likes = [],
    isLoading: areLikesLoading,
    error: likesError,
  } = useQuery({
    queryKey: ['likes'],
    queryFn: () => Requests.fetchData('likes'),
  });

  return (
    <LikesContext.Provider
      value={{
        likes,
        areLikesLoading,
        likesError,
      }}
    >
      {children}
    </LikesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLikes = () => useContext(LikesContext);
