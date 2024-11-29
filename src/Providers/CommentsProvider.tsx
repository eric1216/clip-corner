import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, ReactNode, useContext } from 'react';
import { Requests } from '../api';
import { TComments } from '../types';

type TCommentsContext = {
  comments: TComments[];
  areCommentsLoading: boolean;
  commentsError: unknown;
  postComment: (newGroup: Partial<TComments>) => void;
};

const CommentsContext = createContext<TCommentsContext>({} as TCommentsContext);

export function CommentsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();

  const {
    data: comments = [],
    isLoading: areCommentsLoading,
    error: commentsError,
  } = useQuery({
    queryKey: ['comments'],
    queryFn: () => Requests.fetchData('comments'),
  });

  const postComment = useMutation({
    mutationFn: (newComment: Partial<TComments>) => {
      return Requests.postItem('comments', newComment);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['comments'] });
    },
  });

  return (
    <CommentsContext.Provider
      value={{
        comments,
        areCommentsLoading,
        commentsError,
        postComment: postComment.mutate,
      }}
    >
      {children}
    </CommentsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useComments = () => useContext(CommentsContext);
