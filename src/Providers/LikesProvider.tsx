import { createContext, ReactNode, useContext } from 'react';
import { TLikes } from '../types';
import { Requests } from '../api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type TLikesContext = {
  likes: TLikes[];
  areLikesLoading: boolean;
  likesError: unknown;
  postLike: (newGroup: Partial<TLikes>) => void;
  deleteLike: (likeId: string) => void;
};

const LikesContext = createContext<TLikesContext>({} as TLikesContext);

export function LikesProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const {
    data: likes = [],
    isLoading: areLikesLoading,
    error: likesError,
  } = useQuery({
    queryKey: ['likes'],
    queryFn: () => Requests.fetchData('likes'),
  });

  const postLike = useMutation({
    mutationFn: (newLike: Partial<TLikes>) => {
      return Requests.postItem('likes', newLike);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['likes'] });
    },
  });

  const deleteLike = useMutation({
    mutationFn: (likeId: string) => {
      return Requests.deleteItem('likes', likeId);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['likes'] });
    },
  });

  return (
    <LikesContext.Provider
      value={{
        likes,
        areLikesLoading,
        likesError,
        postLike: postLike.mutate,
        deleteLike: deleteLike.mutate,
      }}
    >
      {children}
    </LikesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useLikes = () => useContext(LikesContext);
