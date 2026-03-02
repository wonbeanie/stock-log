'use client'

import { stocksLoadingAtom } from '@/store/baseAtoms';
import { stocksPriceAtom } from '@/store/price';
import { useAtomValue } from 'jotai';

export default function ReturnRate({returnRate} : {returnRate : number | "NO DATA"}) {
  const {stocksPrice} = useAtomValue(stocksPriceAtom);
  const stocksLoading = useAtomValue(stocksLoadingAtom);

  const getReturnRate = () => {
    if(stocksLoading){
      return "...Loading";
    }

    return `${returnRate.toLocaleString()}%`;
  }

  if (Object.keys(stocksPrice).length === 0 && !stocksLoading) return <></>;

  return <td className="px-6 py-4 text-center text-gray-600 text-sm font-medium">{getReturnRate()}</td>;
}
