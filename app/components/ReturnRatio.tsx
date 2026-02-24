'use client'

import { CurrentStock, exchangeRateAtom, isOfflineAtom } from '../store/atoms';
import { useUnifiedStockData } from '../hooks/useStock';
import { useAtomValue } from 'jotai';

export default function ReturnRatio({stock} : {stock : CurrentStock}) {
  const isOffline = useAtomValue(isOfflineAtom);
  const exchangeRate = useAtomValue(exchangeRateAtom);
  const { isError, isLoading, price, ticker } = useUnifiedStockData(stock.ticker, stock.country);

  const getReturnRate = () => {
    let valueAmount = price ? price.price * stock.amount : 0;

    if(valueAmount <= 0){
      return "NO DATA";
    }

    if(stock.country === "US"){
      valueAmount *= exchangeRate;
    }

    return (valueAmount / stock.amountInput) * 100 - 100;
  }

  if (isOffline) return <></>;

  return <td className="px-6 py-4 text-center text-gray-600 text-sm font-medium">{getReturnRate().toLocaleString()}%</td>;
}
