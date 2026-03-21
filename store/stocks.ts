import { atom } from "jotai";

export const stocksDataAtom = atom<StocksData>({
  totalInvestment : 0,
  currentInvestment : 0,
  realizedProfit : 0,
  dividend : 0,
  currentStocks : {},
  pastSales : [],
});

export const totalInvestmentAtom = atom((get) => get(stocksDataAtom).totalInvestment);
export const currentInvestmentAtom = atom((get) => get(stocksDataAtom).currentInvestment);
export const realizedProfitAtom = atom((get) => get(stocksDataAtom).realizedProfit);
export const dividendAtom = atom((get) => get(stocksDataAtom).dividend);

export const currentStocksAtom = atom(
  (get) => get(stocksDataAtom).currentStocks,
  (get, set, newCurrentStocks : CurrentStocks) => set(stocksDataAtom, {
    ...get(stocksDataAtom),
    currentStocks : newCurrentStocks
  })
);
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
  returnRate : number | "NO DATA";
}

export interface PastSale {
  name : string;
  type : string;
  date : string;
  profits : number;
  amount : number;
  unitPrice : number;
  settledAmount : number;
  ticker : string;
  balance : number;
}