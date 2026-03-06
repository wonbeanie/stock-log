'use client'

import { Chip } from '@mui/material';
import ReturnRate from './ReturnRate';
import { type CurrentStock } from '@/store/stocks';
import React from 'react';

export default React.memo(function CurrentStock({stockName, stock} : {stockName : string, stock : CurrentStock}) {
  return (
    <>
        <td className="px-6 py-4 font-bold text-gray-900 text-sm">{stockName} <div className="text-gray-300 font-normal">{stock.ticker}</div></td>
        <td className="px-6 py-4 text-center">
          <Chip label={`${stock.dateOfPossession.toLocaleString()}일`} size="small" className="bg-blue-50 text-blue-600 font-bold text-[10px]" />
        </td>
        <td className="px-6 py-4 text-center text-gray-600 text-sm font-medium">{stock.amountInput.toLocaleString()}원</td>
        <ReturnRate returnRate={stock.returnRate} />
    </>
  )
});