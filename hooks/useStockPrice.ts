import { GET_PRICE, GET_STOCKS, GET_TICKER, GET_TICKERS, PING_QUERY } from '@/lib/graphql';
import { isOfflineAtom, serverUrlAtom, stocksLoadingAtom } from '@/store/baseAtoms';
import { StocksPrice, stocksPriceAtom } from '@/store/price';
import { stockDashboardAtom } from '@/store/stocks';
import { useQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';

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
  const {currentStocks} = useAtomValue(stockDashboardAtom);
  const [{updateDate}, setStocksPrice] = useAtom(stocksPriceAtom);
  const setStocksLoading = useSetAtom(stocksLoadingAtom);
  const serverUrl = useAtomValue(serverUrlAtom);

  const isUpdateTime = updateDate <= new Date().getTime() - (1000 * 60 * 10);

  const isinList = Object.values(currentStocks)
  .filter((stock)=>stock.country !== "KR")
  .map((stock)=>{
    return stock.ticker;
  });

  const tickersQuery = useQuery({
    queryKey : ["tickers", isinList],
    queryFn : () => request(serverUrl, GET_TICKERS, {isinList}),
    enabled: !isOffLine && !!isinList && !!isUpdateTime
  });

  const tickers = tickersQuery.data?.getTickers || [];

  const usTickers : {[key: string] : string} = {};

  tickers.forEach((ticker: { isin: string; ticker: string; })=>{
    usTickers[ticker.isin] = ticker.ticker;
    usTickers[ticker.ticker] = ticker.isin;
  });

  const stocks = Object.values(currentStocks).map((stock)=>{
    const isUS = stock.country === "US";

    const fianlTicker = isUS ? usTickers[stock.ticker] : stock.ticker;

    return {
      ticker: fianlTicker,
      country: stock.country
    }
  });

  const pricesQuery = useQuery({
    queryKey : ["stocksPrice", stocks],
    queryFn : () => request(serverUrl, GET_STOCKS, {stocks}),
    enabled: !isOffLine && !!stocks && !!isUpdateTime && !!tickersQuery.data,
    refetchInterval: 1000 * 60 * 10,
  });

  const result = pricesQuery.data?.getStocks || [];

  const formatStocksPrice : StocksPrice = {};

  result.forEach((stock : {symbol : string, price : number})=>{
    const ticker = usTickers[stock.symbol] || stock.symbol;
    formatStocksPrice[ticker] = stock.price;
  });

  useEffect(()=>{
    if(!tickersQuery.isLoading && !pricesQuery.isLoading){
      setStocksLoading(false);
    }
    else {
      setStocksLoading(true);
    }
  }, [tickersQuery.isLoading, pricesQuery.isLoading, setStocksLoading]);

  useEffect(() => {
    if(pricesQuery.isSuccess){
      if(Object.keys(formatStocksPrice).length === 0){
        return;
      }
      setStocksPrice({
        stocksPrice : formatStocksPrice,
        updateDate : new Date().getTime()
      });
    }
    if(pricesQuery.isError){
      setStocksPrice({
        stocksPrice : {},
        updateDate : 0
      });
    }
  }, [pricesQuery.isSuccess, pricesQuery.isError, setStocksPrice])

  return pricesQuery;
}