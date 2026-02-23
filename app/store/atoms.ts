import { atom } from 'jotai';
import { excelData, getHash, processExcelData } from '../modules/utils';
import { atomWithStorage } from 'jotai/utils';

export const stocksDataAtom = atomWithStorage<StocksData>("STOCKS_DATA", {
  totalInvestmenet : 0,
  currentInvestment : 0,
  realizedProfit : 0,
  dividend : 0,
  currentStocks : {},
  pastSales : []
});

export const lastHashAtom = atomWithStorage<string>("LAST_HASH", '');

export const totalInvestmentAtom = atom((get) => get(stocksDataAtom).totalInvestmenet);
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
  (get, set, playload : excelData[]) => {
    const newHash = getHash(playload);
    if(newHash === get(lastHashAtom)){
      return;
    }

    const stocksData = processExcelData(playload);

    set(stocksDataAtom, stocksData);
    set(lastHashAtom, newHash)
  }
)
export interface StocksData {
  totalInvestmenet : number;
  currentInvestment : number;
  realizedProfit : number;
  dividend : number;
  currentStocks : {[name : string] : CurrentStock};
  pastSales : PastSale[];
}

export interface CurrentStock {
  name : string;
  ticker : string;
  dateOfPossession : number;
  amountInput : number;
  ratio : number;
}

export interface PastSale {
  name : string;
  type : string;
  date : string;
  profits : number;
  amount : number;
}