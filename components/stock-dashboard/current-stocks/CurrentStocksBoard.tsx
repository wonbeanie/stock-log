'use client'

import { formatTimestamp } from '@/lib/utils'
import { Card, Chip, Typography } from '@mui/material'
import { useAtomValue } from 'jotai';
import { stocksPriceAtom } from '@/store/price';
import {useSortedCurrentStocks} from '@/hooks/useCurrentStocks';
import HeaderReturnRate from './HeaderReturnRate';
import TradeDetailModal from '@/components/modals/TradeDetailModal';
import { useCallback, useState } from 'react';
import StocksScrollView from './StocksScrollView';

export default function CurrentStocksBoard() {
  const {updateDate, stocksPrice} = useAtomValue(stocksPriceAtom);
  const {sortedCurrentStocks, onHandlerSort} = useSortedCurrentStocks();
  const [open, setOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<SelectedStock>({name : "", ticker : ""});

  const onHandlerClick = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const onHandlerStock = useCallback(({name, ticker} : SelectedStock) => {
    setSelectedStock({
      name,
      ticker
    });
    onHandlerClick();
  }, [])

  return (
    <>
      <Card className="shadow-lg border border-gray-100 rounded-3xl flex flex-col h-[600px] overflow-hidden bg-white">
        <div className="p-6 flex justify-between items-center border-b border-gray-50">
          <Typography variant="h6" className="font-bold text-gray-800">현재 보유 종목</Typography>
          <Chip label={`Last updated: ${formatTimestamp(updateDate)}`} size="small" variant="outlined" className="text-gray-400 border-gray-200" />
        </div>
        <div className="flex-grow overflow-y-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-20">
              <tr className="text-gray-400 text-[11px] font-bold uppercase tracking-widest border-b border-gray-50">
                <th className="px-6 py-4 cursor-pointer" onClick={onHandlerSort("name")}>종목명</th>
                <th className="px-6 py-4 text-center cursor-pointer" onClick={onHandlerSort("dateOfPossession")}>보유일</th>
                <th className="px-6 py-4 text-center cursor-pointer" onClick={onHandlerSort("amountInput")}>투입 금액</th>
                <HeaderReturnRate stocksPrice={stocksPrice} onHandlerSort={onHandlerSort("returnRate")}/>
              </tr>
            </thead>
            <StocksScrollView data={sortedCurrentStocks} onHandlerStock={onHandlerStock} />
          </table>
        </div>
      </Card>
      <TradeDetailModal open={open} onClose={onHandlerClick} stockInfo={selectedStock} />
    </>
  )
}

export interface SelectedStock {
  name : string;
  ticker : string;
}