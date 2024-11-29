import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from 'react';
import { Requests } from '../api';
import { TClips } from '../types';

type TClipsContext = {
  clips: TClips[];
  areClipsLoading: boolean;
  clipsError: unknown;
  showUploadForm: boolean;
  setShowUploadForm: Dispatch<SetStateAction<boolean>>;
  postClip: (newGroup: Partial<TClips>) => void;
};

const ClipsContext = createContext<TClipsContext>({} as TClipsContext);

export function ClipsProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [showUploadForm, setShowUploadForm] = useState<boolean>(false);

  const {
    data: clips = [],
    isLoading: areClipsLoading,
    error: clipsError,
  } = useQuery({
    queryKey: ['clips'],
    queryFn: () => Requests.fetchData('clips'),
  });

  const postClip = useMutation({
    mutationFn: (newClip: Partial<TClips>) => {
      return Requests.postItem('clips', newClip);
    },
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['clips'] });
    },
  });

  return (
    <ClipsContext.Provider
      value={{
        clips,
        areClipsLoading,
        clipsError,
        showUploadForm,
        setShowUploadForm,
        postClip: postClip.mutate,
      }}
    >
      {children}
    </ClipsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useClips = () => useContext(ClipsContext);
