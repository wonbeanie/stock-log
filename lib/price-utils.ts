import type { StocksPrice } from "@/store/price";
import { CurrentStockTable } from "./db";
import { RequestStocks, responsePrice, USTicker } from "./type/stock-price";

export function getIsinList(currentStocks : CurrentStockTable[]){
  return currentStocks
  .filter((stock)=>stock.country !== "KR")
  .map((stock)=>{
    return stock.ticker;
  });
}

export function formatTickers(tickers : { isin: string; ticker: string; }[]){
  let result : USTicker = {};
  tickers.forEach((ticker: { isin: string; ticker: string; })=>{
    if(ticker.isin && ticker.ticker){
      result[ticker.isin] = ticker.ticker;
      result[ticker.ticker] = ticker.isin;
    }
  });
  return result;
}

export function getRequestStocks(currentStocks : CurrentStockTable[], usTickers : USTicker) : RequestStocks[]{
  return currentStocks.map((stock)=>{
    const isUS = stock.country === "US";

    const fianlTicker = isUS ? usTickers[stock.ticker] : stock.ticker;

    return {
      ticker: fianlTicker,
      country: stock.country
    }
  });
}

export function formatPriceData(resData : responsePrice[], usTickers : USTicker){
  const formatStocksPrice : StocksPrice = {};
  resData.forEach((stock : {symbol : string, price : number})=>{
    const ticker = usTickers[stock.symbol] || stock.symbol;
    formatStocksPrice[ticker] = stock.price;
  });

  return formatStocksPrice;
}