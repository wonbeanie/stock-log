import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { excelDatAtom } from "./excel";
import { currentStocksAtom, stocksDataAtom } from "./stocks";
import { processExcelData } from "@/lib/excel";
import { stocksLoadingAtom } from "./baseAtoms";
import { formatCurrentStocksPrice } from "@/lib/utils";

export const exchangeRateAtom = atomWithStorage<number>(
  "EXCHANGE_RATE", 1450 , undefined, { getOnInit: true }
);

export const stocksPriceAtom = atomWithStorage<PriceInfo>("STOCKS_PRICE", {
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

export const updateStocksPriceAtom = atom(
  null,
  (get, set, priceInfo : PriceInfo) => {
    const currentStocks = get(currentStocksAtom);
    const exchangeRate = get(exchangeRateAtom);
    const newCurrentStocks = formatCurrentStocksPrice(currentStocks, priceInfo.stocksPrice, exchangeRate);

    set(currentStocksAtom, newCurrentStocks);
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