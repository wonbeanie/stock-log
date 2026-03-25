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