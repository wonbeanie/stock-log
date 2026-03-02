'use client'

import { stocksLoadingAtom } from '@/store/baseAtoms';
import { StocksPrice } from '@/store/price';
import { useAtomValue } from 'jotai';
import React from 'react'

export default function HeaderReturnRate({stocksPrice, onHandlerSort} : Props) {
  const stocksLoading = useAtomValue(stocksLoadingAtom);

  return !(Object.keys(stocksPrice).length === 0 && !stocksLoading) ? (
    <th className="px-6 py-4 text-center cursor-pointer" onClick={onHandlerSort}>수익률</th>
  ) : 
  <></>
}

interface Props {
  stocksPrice : StocksPrice;
  onHandlerSort : (e: React.MouseEvent<HTMLTableCellElement>) => void;
}