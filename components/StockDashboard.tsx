'use client'

import { Card, Chip, Grid, Typography } from '@mui/material'
import { useAtomValue } from 'jotai';
import { CurrentStock as CurrentStockType, exchangeRateAtom, stockDashboardAtom, stocksLoadingAtom, stocksPriceAtom } from '../store/atoms';
import CurrentStock from './CurrentStock';
import { formatDate, formatReturnRate } from '@/lib/modules';
import { useState } from 'react';

export default function StockDashboard() {
  const {currentStocks, pastSales} = useAtomValue(stockDashboardAtom);
  const {updateDate} = useAtomValue(stocksPriceAtom);
  const {stocksPrice} = useAtomValue(stocksPriceAtom);
  const stocksLoading = useAtomValue(stocksLoadingAtom);
  const [sortType, setSortType] = useState<string>("stockName");
  const [orderType, setOrderType] = useState<string>("ASC");
  const exchangeRate = useAtomValue(exchangeRateAtom);

  const onHandlerSort = (type : string) => {
    return (e : React.MouseEvent<HTMLTableCellElement>) => {
      e.preventDefault();
      if(sortType === type){
          orderType === "ASC" ? setOrderType("DESC") : setOrderType("ASC");
          return;
      }
      setSortType(type);
    }
  }

  const sorting = ([aName, aStock] : [string, CurrentStockType], [bName, bStock] : [string, CurrentStockType]) => {
    if(sortType === "stockName"){
      if(orderType === "DESC"){
        return bName.localeCompare(aName);
      }
      return aName.localeCompare(bName);
    }
    if(sortType === "dateOfPossession"){
      if(orderType === "DESC"){
        return bStock.dateOfPossession - aStock.dateOfPossession;
      }
      return aStock.dateOfPossession - bStock.dateOfPossession;
    }
    if(sortType === "amountInput"){
      if(orderType === "DESC"){
        return bStock.amountInput - aStock.amountInput;
      }
      return aStock.amountInput - bStock.amountInput;
    }
    if(sortType === "returnRate"){
      const aReturnRate = formatReturnRate(aStock, stocksPrice, exchangeRate);
      const bReturnRate = formatReturnRate(bStock, stocksPrice, exchangeRate);

      if(aReturnRate === "NO DATA"){
        return 1;
      }
      if(bReturnRate === "NO DATA"){
        return -1;
      }

      if(orderType === "DESC"){
        return bReturnRate - aReturnRate;
      }
      return aReturnRate - bReturnRate;
    }

    return 0;
  }

  return (
    <Grid container spacing={4} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Grid size={{ xs: 12, md: 7 }}>
        <Card className="shadow-lg border border-gray-100 rounded-3xl flex flex-col h-[600px] overflow-hidden bg-white">
          <div className="p-6 flex justify-between items-center border-b border-gray-50">
            <Typography variant="h6" className="font-bold text-gray-800">현재 보유 종목</Typography>
            <Chip label={`Last updated: ${formatDate(updateDate)}`} size="small" variant="outlined" className="text-gray-400 border-gray-200" />
          </div>
          <div className="flex-grow overflow-y-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-20">
                <tr className="text-gray-400 text-[11px] font-bold uppercase tracking-widest border-b border-gray-50">
                  <th className="px-6 py-4 cursor-pointer" onClick={onHandlerSort("stockName")}>종목명</th>
                  <th className="px-6 py-4 text-center cursor-pointer" onClick={onHandlerSort("dateOfPossession")}>보유일</th>
                  <th className="px-6 py-4 text-center cursor-pointer" onClick={onHandlerSort("amountInput")}>투입 금액</th>
                  {
                    !(Object.keys(stocksPrice).length === 0 && !stocksLoading) &&
                    <th className="px-6 py-4 text-center cursor-pointer" onClick={onHandlerSort("returnRate")}>수익률</th>
                  }
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {
                  Object.entries(currentStocks).sort(sorting).map(([stockName, stock], i) => {
                    return (
                      <CurrentStock key={stockName} stockName={stockName} stock={stock}/>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <Card className="shadow-lg border border-gray-100 rounded-3xl flex flex-col h-[600px] overflow-hidden bg-white">
          <div className="p-6 border-b border-gray-50">
            <Typography variant="h6" className="font-bold text-gray-800">과거 매매</Typography>
          </div>
          <div className="p-4 space-y-3 flex-grow overflow-y-auto custom-scrollbar bg-gray-50/30">
            {
              pastSales.map((history, i) => {
                const minus = history.profits < 0;
                const isBuy = history.type === "매수";
                const typeColor = isBuy ?
                'bg-gray-100 text-gray-600' :
                minus ?
                'bg-blue-50 text-blue-600' :
                'bg-red-50 text-red-600';

                const typeLabel = isBuy ? "매수금" : "수익금";
                const profitColor = isBuy ?
                'text-gray-900' :
                minus ? 'text-blue-500' : 'text-red-500';

                return (
                  <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex gap-3 items-center">
                      <div className={`w-11 h-11 rounded-2xl ${typeColor} flex flex-col items-center justify-center transition-colors`}>
                        <span className="text-xs font-black">{history.type}</span>
                      </div>

                      <div>
                        <Typography className="font-bold text-sm text-gray-800 flex items-center gap-1">
                          {history.name}
                        </Typography>
                        <Typography className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                          {history.date}
                        </Typography>
                      </div>
                    </div>

                    <div className="text-right">
                      <Typography className="text-[10px] text-gray-400 font-bold">{typeLabel}</Typography>
                      <div className="flex flex-col">
                        <Typography className={`font-black ${profitColor} text-sm`}>
                          {!isBuy && !minus && "+"}
                          {history.profits.toLocaleString()}원
                        </Typography>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </Card>
      </Grid>
    </Grid>
  )
}
