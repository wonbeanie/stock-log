'use client'

import { CurrentStock, exchangeRateAtom, isOfflineAtom, stocksPriceAtom } from '../store/atoms';
import { useAtomValue } from 'jotai';

export default function ReturnRatio({stock} : {stock : CurrentStock}) {
  const isOffline = useAtomValue(isOfflineAtom);
  const exchangeRate = useAtomValue(exchangeRateAtom);
  const {stocksPrice} = useAtomValue(stocksPriceAtom);

  const getReturnRate = () => {
    const price = stocksPrice[stock.ticker];

    let valueAmount = price ? price * stock.amount : 0;

    if(valueAmount <= 0){
      return "NO DATA";
    }

    if(stock.country === "US"){
      valueAmount *= exchangeRate;
    }

    return (valueAmount / stock.amountInput) * 100 - 100;
  }

  if (Object.keys(stocksPrice).length === 0) return <></>;

  return <td className="px-6 py-4 text-center text-gray-600 text-sm font-medium">{getReturnRate().toLocaleString()}%</td>;
}
