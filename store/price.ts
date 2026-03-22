import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { currentStocksAtom } from "./stocks";
import { stocksLoadingAtom } from "./baseAtoms";
import { formatCurrentStocksPrice, updateExchangeRatio } from "@/lib/utils";

export const exchangeRateAtom = atomWithStorage<number>(
  "EXCHANGE_RATE", 1450 , undefined, { getOnInit: true }
);

export const stocksPriceAtom = atomWithStorage<PriceInfo>("STOCKS_PRICE", {
  stocksPrice : {},
  updateDate : 0
} , undefined);

export const updateExchangeRatioAtom = atom(
  null,
  async (get, set, exchangeRate : number) => {
    await updateExchangeRatio(exchangeRate);
    set(exchangeRateAtom, exchangeRate);
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