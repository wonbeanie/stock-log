import type { StocksPrice } from "@/store/price";
import { CurrentStockTable } from "./db";

export const formatReturnRate = (stock : CurrentStockTable, stocksPrice : StocksPrice, exchangeRate = 1450) => {
  const price = stocksPrice[stock.ticker];

  let valueAmount = price ? price * stock.amount : 0;

  if(valueAmount <= 0){
    return "NO DATA";
  }

  if(stock.country === "US"){
    valueAmount *= exchangeRate;
  }

  const result = (valueAmount / stock.amountInput) * 100 - 100;

  return Math.round(result * 100) / 100;
}

interface USTicker {
  [key: string] : string
}

interface responsePrice {
    symbol : string,
    price : number
};

interface RequestStocks {
  ticker: string;
  country: string;
}