import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { stocksLoadingAtom } from "./baseAtoms";
import { updateWorkerExchangeRatio } from "@/lib/utils";
import { LocalStorageKey } from "@/lib/type/storage";

export const exchangeRateAtom = atomWithStorage<number>(
  LocalStorageKey.EXCHANGE_RATE, 1450 , undefined, { getOnInit: true }
);

export const stocksPriceAtom = atomWithStorage<PriceInfo>("STOCKS_PRICE", {
  stocksPrice : {},
  updateDate : 0
} , undefined);

export const updateExchangeRatioAtom = atom(
  null,
  async (get, set, exchangeRate : number) => {
    try{
      await updateWorkerExchangeRatio(exchangeRate);
      set(exchangeRateAtom, exchangeRate);
    }
    catch(err){
      console.error(err);
    }
  }
)

export const updateStocksPriceAtom = atom(
  null,
  (get, set, priceInfo: PriceInfo) => {
    set(stocksPriceAtom, priceInfo);
    set(stocksLoadingAtom, false);
  }
);

export interface StocksPrice {
  [name: string] : number
}

export interface PriceInfo {
  stocksPrice : StocksPrice;
  updateDate : number;
}