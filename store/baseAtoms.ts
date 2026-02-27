import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export const serverUrlAtom = atomWithStorage<string>(
  "SERVER_URL", "http://localhost:4000", undefined, { getOnInit: true }
);
export const isOfflineAtom = atom<boolean>(true);
export const stocksLoadingAtom = atom(false);