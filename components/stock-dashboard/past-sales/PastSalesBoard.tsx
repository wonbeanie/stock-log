'use client'

import { stockDashboardAtom } from '@/store/stocks';
import { Card, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import HistoryCard from './HistoryCard';

export default function PastSalesBoard() {
  const {pastSales} = useAtomValue(stockDashboardAtom);

  return (
    <Card className="shadow-lg border border-gray-100 rounded-3xl flex flex-col h-[600px] overflow-hidden bg-white">
      <div className="p-6 border-b border-gray-50">
        <Typography variant="h6" className="font-bold text-gray-800">과거 매매</Typography>
      </div>
      <div className="p-4 space-y-3 flex-grow overflow-y-auto custom-scrollbar bg-gray-50/30">
        {
          pastSales.map(({date, name, profits, type}, i) => {
            return (
              <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <HistoryCard profits={profits} type={type} name={name} date={date}/>
              </div>
            )
          })
        }
      </div>
    </Card>
  )
}
