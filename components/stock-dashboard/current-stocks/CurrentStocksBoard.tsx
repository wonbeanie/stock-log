'use client'

import { formatTimestamp } from '@/lib/utils'
import { Card, Chip, Typography } from '@mui/material'
import { useAtomValue } from 'jotai';
import { stocksPriceAtom } from '@/store/price';
import {useSortedCurrentStocks} from '@/hooks/useCurrentStocks';
import HeaderReturnRate from './HeaderReturnRate';
import CurrentStock from './CurrentStock';

export default function CurrentStocksBoard() {
  const {updateDate, stocksPrice} = useAtomValue(stocksPriceAtom);
  const {sortedCurrentStocks, onHandlerSort} = useSortedCurrentStocks();
  
  return (
    <Card className="shadow-lg border border-gray-100 rounded-3xl flex flex-col h-[600px] overflow-hidden bg-white">
      <div className="p-6 flex justify-between items-center border-b border-gray-50">
        <Typography variant="h6" className="font-bold text-gray-800">현재 보유 종목</Typography>
        <Chip label={`Last updated: ${formatTimestamp(updateDate)}`} size="small" variant="outlined" className="text-gray-400 border-gray-200" />
      </div>
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-20">
            <tr className="text-gray-400 text-[11px] font-bold uppercase tracking-widest border-b border-gray-50">
              <th className="px-6 py-4 cursor-pointer" onClick={onHandlerSort("stockName")}>종목명</th>
              <th className="px-6 py-4 text-center cursor-pointer" onClick={onHandlerSort("dateOfPossession")}>보유일</th>
              <th className="px-6 py-4 text-center cursor-pointer" onClick={onHandlerSort("amountInput")}>투입 금액</th>
              <HeaderReturnRate stocksPrice={stocksPrice} onHandlerSort={onHandlerSort("returnRate")}/>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {
              sortedCurrentStocks.map(([stockName, stock], i) => {
                return (
                  <CurrentStock key={stockName} stockName={stockName} stock={stock}/>
                )
              })
            }
          </tbody>
        </table>
      </div>
    </Card>
  )
}