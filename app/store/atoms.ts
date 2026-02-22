import { atom } from 'jotai';
import { excelData, processExcelData } from '../modules/utils';

export const totalInvestmentAtom = atom(0);
export const currentInvestmentAtom = atom(0);
export const realizedProfitAtom = atom(0);
export const dividendAtom = atom(0);

export const currentStocksAtom = atom<{[name: string]: CurrentStock}>({});
export const pastSalesAtom = atom<PastSale[]>([]);

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

export const updateExcelDataAtom = atom(
  null,
  (get, set, playload : excelData[]) => {
    const data = processExcelData(playload as excelData[]);
    set(totalInvestmentAtom, data.totalInvestmenet);
    set(currentInvestmentAtom, data.currentInvestment);
    set(realizedProfitAtom, data.realizedProfit);
    set(dividendAtom, data.dividend);
    set(currentStocksAtom, data.currentStocks);
    set(pastSalesAtom, data.pastSales);
  }
)

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
}