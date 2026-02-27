'use client'

import { formatReturnRate } from '@/lib/utils';
import { stocksLoadingAtom } from '@/store/baseAtoms';
import { exchangeRateAtom, stocksPriceAtom } from '@/store/price';
import { CurrentStock } from '@/store/stocks';
import { useAtomValue } from 'jotai';

export default function ReturnRatio({stock} : {stock : CurrentStock}) {
  const exchangeRate = useAtomValue(exchangeRateAtom);
  const {stocksPrice} = useAtomValue(stocksPriceAtom);
  const stocksLoading = useAtomValue(stocksLoadingAtom);

  const getReturnRate = () => {
    if(stocksLoading){
      return "...Loading";
    }

    return `${formatReturnRate(stock, stocksPrice, exchangeRate).toLocaleString()}%`;
  }

  if (Object.keys(stocksPrice).length === 0 && !stocksLoading) return <></>;

  return <td className="px-6 py-4 text-center text-gray-600 text-sm font-medium">{getReturnRate().toLocaleString()}</td>;
}
