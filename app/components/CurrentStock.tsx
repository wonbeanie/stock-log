'use client'

import { eventBus } from '../modules/modules';
import { Events } from '../modules/events';
import { Chip } from '@mui/material';
import type { CurrentStock } from '../store/atoms'
import ReturnRatio from './ReturnRatio';

export default function CurrentStock({stockName, stock} : {stockName : string, stock : CurrentStock}) {
  const showDetail = (stockName : string) => {
    eventBus.emit(Events.SHOW_DETAIL_MODAL, stockName);
  }

  return (
    <tr className="hover:bg-gray-50/50 transition-colors group" onClick={()=>showDetail(stockName)}>
      <td className="px-6 py-4 font-bold text-gray-900 text-sm">{stockName} <div className="text-gray-300 font-normal">{stock.ticker}</div></td>
      <td className="px-6 py-4 text-center">
        <Chip label={`${stock.dateOfPossession.toLocaleString()}일`} size="small" className="bg-blue-50 text-blue-600 font-bold text-[10px]" />
      </td>
      <td className="px-6 py-4 text-center text-gray-600 text-sm font-medium">{stock.amountInput.toLocaleString()}원</td>
      <ReturnRatio stock={stock} />
    </tr>
  )
}
