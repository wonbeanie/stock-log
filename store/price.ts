import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { excelDatAtom } from "./excel";
import { stocksDataAtom } from "./stocks";
import { processExcelData } from "@/lib/excel";

export const exchangeRateAtom = atomWithStorage<number>(
  "EXCHANGE_RATE", 1450 , undefined, { getOnInit: true }
);

export const stocksPriceAtom = atomWithStorage<{
  stocksPrice : StocksPrice;
  updateDate : number;
}>("STOCKS_PRICE", {
  stocksPrice : {},
  updateDate : 0
} , undefined);

export const updateExchangeRatioAtom = atom(
  null,
  (get, set, exchangeRate : number) => {
    const excelData = get(excelDatAtom);
    const stocksData = processExcelData(excelData, exchangeRate);

    set(stocksDataAtom, stocksData);
    set(exchangeRateAtom, exchangeRate);
  }
)

export interface StocksPrice {
  [name: string] : number
}