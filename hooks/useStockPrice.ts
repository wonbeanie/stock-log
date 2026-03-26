import { StocksDB } from '@/lib/db';
import { GET_STOCKS } from '@/lib/graphql';
import { isOfflineAtom, serverUrlAtom } from '@/store/baseAtoms';
import { stocksPriceAtom } from '@/store/price';
import { useQuery } from '@tanstack/react-query';
import { request, } from 'graphql-request';
import { useAtomValue } from 'jotai';
import { useLiveQuery } from 'dexie-react-hooks';
import { useMemo } from 'react';
import { formatPriceData, getIsinList, getRequestStocks } from '@/lib/price-utils';
import { useUSTickers } from './useUSTickers';

export const useStocksPriceData = () => {
  const isOffLine = useAtomValue(isOfflineAtom);
  const serverUrl = useAtomValue(serverUrlAtom);
  const {updateDate} = useAtomValue(stocksPriceAtom);
  const currentStocksDB = useLiveQuery(() => StocksDB.currentStocks.toArray());

  const isDBLoaded = !!currentStocksDB;
  const isUpdateTime = updateDate <= new Date().getTime() - (1000 * 60 * 10);
  const isinList = useMemo(() => getIsinList(currentStocksDB || []).sort(), [currentStocksDB]);

  const {data : usTickers, isLoading : isTickersLoading } = useUSTickers(
    isinList,
    !isOffLine && isUpdateTime
  );

  const requestStocks = useMemo(
    () => getRequestStocks(currentStocksDB || [], usTickers || {}),
    [currentStocksDB, usTickers]
  );

  const isOnlyKRTicker = isinList.length === 0 || !!usTickers;
  const isStocksPriceQueryEnable = !isOffLine && !!requestStocks && !!isUpdateTime && isOnlyKRTicker;
  const {data : priceInfo, isLoading : isPriceLoading} = useQuery({
    queryKey : ["stocksPrice", requestStocks],
    queryFn : () => request(serverUrl, GET_STOCKS, {stocks : requestStocks}),
    enabled: isStocksPriceQueryEnable,
    refetchInterval: 1000 * 60 * 10,
    select: (data) => ({
      stocksPrice : formatPriceData(data.getStocks, usTickers || {}),
      updateDate : Date.now()
    })
  });

  const totalLoading = isTickersLoading || isPriceLoading;
  return {
    priceInfo: isStocksPriceQueryEnable ? priceInfo : null,
    isLoading: isDBLoaded ? totalLoading : true,
    isComplete : isDBLoaded && !totalLoading && !!priceInfo
  };
}