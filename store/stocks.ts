import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { excelDatAtom, lastHashAtom } from "./excel";
import { excelData, processExcelData } from "@/lib/excel";
import { getHash } from "@/lib/utils";

export const stocksDataAtom = atomWithStorage<StocksData>("STOCKS_DATA", {
  totalInvestment : 0,
  currentInvestment : 0,
  realizedProfit : 0,
  dividend : 0,
  currentStocks : {},
  pastSales : []
});

export const totalInvestmentAtom = atom((get) => get(stocksDataAtom).totalInvestment);
export const currentInvestmentAtom = atom((get) => get(stocksDataAtom).currentInvestment);
export const realizedProfitAtom = atom((get) => get(stocksDataAtom).realizedProfit);
export const dividendAtom = atom((get) => get(stocksDataAtom).dividend);

export const currentStocksAtom = atom((get) => get(stocksDataAtom).currentStocks);
export const pastSalesAtom = atom((get) => get(stocksDataAtom).pastSales);


export const stockDashboardAtom = atom((get)=>({
  currentStocks : get(currentStocksAtom),
  pastSales : get(pastSalesAtom)
}))

export const summaryOverviewAtom = atom((get) => ({
  total: get(totalInvestmentAtom),
  current: get(currentInvestmentAtom),
  profit: get(realizedProfitAtom),
  dividend: get(dividendAtom),
}));

export const updateStocksDataAtom = atom(
  null,
  (get, set, excelData : excelData[]) => {
    const newHash = getHash(excelData);
    if(newHash === get(lastHashAtom)){
      return;
    }

    const stocksData = processExcelData(excelData);

    set(excelDatAtom, excelData);
    set(stocksDataAtom, stocksData);
    set(lastHashAtom, newHash)
  }
)

export interface StocksData {
  totalInvestment : number;
  currentInvestment : number;
  realizedProfit : number;
  dividend : number;
  currentStocks : CurrentStocks;
  pastSales : PastSale[];
}

export type CurrentStocks = {
  [name : string] : CurrentStock
};

export interface CurrentStock {
  name : string;
  ticker : string;
  dateOfPossession : number;
  amountInput : number;
  amount : number;
  country: string;
}

export interface PastSale {
  name : string;
  type : string;
  date : string;
  profits : number;
  amount : number;
}