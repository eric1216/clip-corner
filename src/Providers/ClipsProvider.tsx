import { useQuery } from '@tanstack/react-query';
import { createContext, ReactNode, useContext } from 'react';
import { Requests } from '../api';
import { TClips } from '../types';

type TClipsContext = {
  clips: TClips[];
  areClipsLoading: boolean;
  clipsError: unknown;
};

const ClipsContext = createContext<TClipsContext>({} as TClipsContext);

export function ClipsProvider({ children }: { children: ReactNode }) {
  const {
    data: clips = [],
    isLoading: areClipsLoading,
    error: clipsError,
  } = useQuery({
    queryKey: ['clips'],
    queryFn: () => Requests.fetchData('clips'),
  });

  return (
    <ClipsContext.Provider
      value={{
        clips,
        areClipsLoading,
        clipsError,
      }}
    >
      {children}
    </ClipsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useClips = () => useContext(ClipsContext);
