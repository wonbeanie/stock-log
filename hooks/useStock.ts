import { useQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { isOfflineAtom, stockDashboardAtom, StocksPrice, stocksPriceAtom } from '../store/atoms';
import { useEffect } from 'react';

const ENDPOINT = "http://localhost:4000/"

// 1. ISIN으로 Ticker를 찾는 쿼리 (미국 전용)
const GET_TICKER = gql`
  query GetTicker($isin: String!) {
    getTicker(isin: $isin) {
      ticker
    }
  }
`;

// 2. 가격을 가져오는 쿼리
const GET_PRICE = gql`
  query GetStock($ticker: String!, $market: String!) {
    getStock(ticker: $ticker, market: $market) {
      price
    }
  }
`;

export function useUnifiedStockData(data: string, market: string) {
  const isOffLine = useAtomValue(isOfflineAtom);
  const isUS = market === 'US';

  const tickerQuery = useQuery({
    queryKey: ['ticker', data],
    queryFn: () => request(ENDPOINT, GET_TICKER, { isin: data }),
    enabled: !!data && isUS && !isOffLine,
  });

  const finalTicker = isUS ? tickerQuery.data?.getTicker?.ticker : data;

  const priceQuery = useQuery({
    queryKey: ['price', finalTicker, market],
    queryFn: () => request(ENDPOINT, GET_PRICE, { 
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

const GET_STOCKS = gql`
  query GetStocks($stocks : [Stock]!) {
    getStocks(stocks : $stocks) {
      symbol
      price
    }
  }
`;

const GET_TICKERS = gql`
  query GetTickers($isinList : [String]!){
    getTickers(isinList : $isinList){
      ticker,
      isin
    }
  }
`

export const useStocksPriceData = () => {
  const isOffLine = useAtomValue(isOfflineAtom);
  const {currentStocks} = useAtomValue(stockDashboardAtom);
  const [{updateDate}, setStocksPrice] = useAtom(stocksPriceAtom);

  const updateTime = updateDate <= new Date().getTime() - (1000 * 60 * 10);

  const isinList = Object.values(currentStocks)
  .filter((stock)=>stock.country !== "KR")
  .map((stock)=>{
    return stock.ticker;
  });

  const tickersQuery = useQuery({
    queryKey : ["tickers", isinList],
    queryFn : () => request(ENDPOINT, GET_TICKERS, {isinList}),
    enabled: !isOffLine && !!isinList && !!updateTime
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
    queryFn : () => request(ENDPOINT, GET_STOCKS, {stocks}),
    enabled: !isOffLine && !!stocks && !!updateTime,
    refetchInterval: 1000 * 60 * 10,
  });

  const result = pricesQuery.data?.getStocks || [];

  const formatStocksPrice : StocksPrice = {};

  result.forEach((stock : {symbol : string, price : number})=>{
    const ticker = usTickers[stock.symbol] || stock.symbol;
    formatStocksPrice[ticker] = stock.price;
  });

  useEffect(() => {
    if(pricesQuery.isSuccess){
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

const PING_QUERY = gql`
  query Ping {
    ping
  }
`;

export function useServerCheck(){
  const setIsOffLine = useSetAtom(isOfflineAtom);

  const query = useQuery({
    queryKey : ['serverStatus'],
    queryFn: () => request('http://localhost:4000/', PING_QUERY),
    retry: 1,
    staleTime: 1000 * 60 * 5
  });

  useEffect(() => {
    if(query.isSuccess){
      setIsOffLine(false);
    }
    if(query.isError){
      setIsOffLine(true);
    }
  }, [query.isSuccess, query.isError, setIsOffLine])

  return query;
}