import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const serverUrlAtom = atomWithStorage<string>(
  "SERVER_URL", "http://localhost:4000", undefined, { getOnInit: true }
);
export const isOfflineAtom = atom<boolean>(true);
export const stocksLoadingAtom = atom(false);

export const updateLoadingAtom = atom(
  null,
  (get, set, {
    isLoading,
    isComplete
  } : {
    isLoading : boolean;
    isComplete : boolean;
  }) => {
    if(!isLoading && !isComplete){
      set(stocksLoadingAtom, false);
      return;
    }

    if(isLoading && !isComplete){
      set(stocksLoadingAtom, true);
      return;
    }

    if(isComplete){
      set(stocksLoadingAtom, false);
    }
  }
)