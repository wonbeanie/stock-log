import { LocalStorageKey } from "@/lib/type/storage";
import { del, get, set } from "idb-keyval";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const isServer = typeof window === 'undefined';

const idbStorage = {
  getItem: async (key : string) => {
    if (isServer) return null;
    const value = await get(key);
    return value !== undefined ? value : null;
  },
  setItem: async (key : string, value : unknown) => {
    if (isServer) return;
    await set(key, value);
  },
  removeItem: async (key : string) => {
    if (isServer) return;
    await del(key);
  },
};

export const lastHashAtom = atomWithStorage<string>(
  LocalStorageKey.LAST_HASH, '', idbStorage, { getOnInit: true }
);

export const updateLastHashAtom = atom(
  null,
  async (getAtom, setAtom) => {
    const lastHash = await get(LocalStorageKey.LAST_HASH) || "";
    setAtom(lastHashAtom, lastHash);
  }
)