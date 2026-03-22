import { CurrentStockTable, StocksDB } from '@/lib/db';
import { GET_PRICE, GET_STOCKS, GET_TICKER, GET_TICKERS } from '@/lib/graphql';
import { isOfflineAtom, serverUrlAtom } from '@/store/baseAtoms';
import { PriceInfo, StocksPrice, stocksPriceAtom } from '@/store/price';
import { CurrentStocks, stockDashboardAtom } from '@/store/stocks';
import { useQuery } from '@tanstack/react-query';
import { request, } from 'graphql-request';
import { useAtomValue } from 'jotai';
import { useLiveQuery } from 'dexie-react-hooks';

export function useUnifiedStockData(data: string, market: string) {
  const isOffLine = useAtomValue(isOfflineAtom);
  const serverUrl = useAtomValue(serverUrlAtom);

  const isUS = market === 'US';

  const tickerQuery = useQuery({
    queryKey: ['ticker', data],
    queryFn: () => request(serverUrl, GET_TICKER, { isin: data }),
    enabled: !!data && isUS && !isOffLine,
  });

  const finalTicker = isUS ? tickerQuery.data?.getTicker?.ticker : data;

  const priceQuery = useQuery({
    queryKey: ['price', finalTicker, market],
    queryFn: () => request(serverUrl, GET_PRICE, { 
      ticker: finalTicker, 
      market: market 
    }),
    enabled: !isOffLine && !!finalTicker && (!isUS || !!tickerQuery.data),
    refetchInterval: 1000 * 60 * 10,
  });

  const price = isOffLine ? null : priceQuery.data?.getStock;

  return {
    ticker: isOffLine ? data : finalTicker,
    isLoading: isOffLine && (tickerQuery.isLoading || priceQuery.isLoading),
    isError: isOffLine && (tickerQuery.isError || priceQuery.isError),
    price,
  };
}

export const useStocksPriceData = () => {
  const isOffLine = useAtomValue(isOfflineAtom);

  const currentStocks = useLiveQuery(() => StocksDB.currentStocks.toArray()) || [];

  const {updateDate} = useAtomValue(stocksPriceAtom);
  const serverUrl = useAtomValue(serverUrlAtom);

  const isUpdateTime = updateDate <= new Date().getTime() - (1000 * 60 * 10);

  const isinList = getIsinList(currentStocks);

  const isTickersQueryEnable = !isOffLine && isinList.length > 0 && !!isUpdateTime;
  const {data: tickerQueryData} = useQuery({
    queryKey : ["tickers", isinList],
    queryFn : () => request(serverUrl, GET_TICKERS, {isinList}),
    enabled: isTickersQueryEnable,
    select: (data) => data.getTickers,
  });

  const tickers = tickerQueryData || [];

  const usTickers = getUSTickers(tickers);

  const requestStocks = getRequestStocks(currentStocks, usTickers);

  const isStocksPriceQueryEnable = !isOffLine && !!requestStocks && !!isUpdateTime && !tickerQueryData;

  const {data : pricesQueryData} = useQuery({
    queryKey : ["stocksPrice", requestStocks],
    queryFn : () => request(serverUrl, GET_STOCKS, {stocks : requestStocks}),
    enabled: isStocksPriceQueryEnable,
    refetchInterval: 1000 * 60 * 10,
    select: (data) => data.getStocks,
  });

  if(!isStocksPriceQueryEnable){
    return {
      priceInfo : null,
      isLoading : false,
      isComplete : true
    };
  }

  if(!pricesQueryData){
    return {
      priceInfo : null,
      isLoading: true,
      isComplete: false,
    };
  }

  if(pricesQueryData.length === 0){
    return {
      priceInfo : null,
      isLoading: true,
      isComplete: false,
    }
  }

  const priceData = (pricesQueryData || []) as responsePrice[];
  const formatStocksPrice = getStocksPrice(priceData, usTickers);
  const priceInfo : PriceInfo = {
    stocksPrice : formatStocksPrice,
    updateDate : new Date().getTime()
  };
  return {
    priceInfo,
    isLoading: false,
    isComplete : true
  };
}

function getIsinList(currentStocks : CurrentStockTable[]){
  return currentStocks
  .filter((stock)=>stock.country !== "KR")
  .map((stock)=>{
    return stock.ticker;
  });
}

function getUSTickers(tickers : { isin: string; ticker: string; }[]){
  let result : USTicker = {};
  tickers.forEach((ticker: { isin: string; ticker: string; })=>{
    if(ticker.isin === null || ticker.ticker === null){
      return;
    }
    result[ticker.isin] = ticker.ticker;
    result[ticker.ticker] = ticker.isin;
  });

  return result;
}

function getRequestStocks(currentStocks : CurrentStockTable[], usTickers : USTicker) : RequestStocks[]{
  return currentStocks.map((stock)=>{
    const isUS = stock.country === "US";

    const fianlTicker = isUS ? usTickers[stock.ticker] : stock.ticker;

    return {
      ticker: fianlTicker,
      country: stock.country
    }
  });
}

function getStocksPrice(resData : responsePrice[], usTickers : USTicker){
  let formatStocksPrice : StocksPrice = {};
  resData.forEach((stock : {symbol : string, price : number})=>{
    const ticker = usTickers[stock.symbol] || stock.symbol;
    formatStocksPrice[ticker] = stock.price;
  });

  return formatStocksPrice;
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