import { useQuery } from '@tanstack/react-query';
import { request, gql } from 'graphql-request';
import { useAtomValue, useSetAtom } from 'jotai';
import { isOfflineAtom } from '../store/atoms';
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


  return {
    ticker: isOffLine ? data : finalTicker,
    price: isOffLine ? null : priceQuery.data?.getStock,
    isLoading: isOffLine && (tickerQuery.isLoading || priceQuery.isLoading),
    isError: isOffLine && (tickerQuery.isError || priceQuery.isError),
  };
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
    staleTime: 1000 * 60
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