'use client'

import { stockDashboardAtom } from '@/store/stocks';
import { Card, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import HistoryCard from './HistoryCard';
import TradeDetailModal from '@/components/modals/TradeDetailModal';
import { useCallback, useState } from 'react';

export default function PastSalesBoard() {
  const {pastSales} = useAtomValue(stockDashboardAtom);
  const [open, setOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<SelectedHistory>({
    name : "",
    ticker : ""
  });
  
  const onHandlerModal = useCallback(() => {
    setOpen(!open);
  }, [open]);

  const onHandlerCard = useCallback(({name, ticker} : SelectedHistory) => {
    setSelectedHistory({
      name,
      ticker
    });
    onHandlerModal();
  }, []);

  return (
    <>
      <Card className="shadow-lg border border-gray-100 rounded-3xl flex flex-col h-[600px] overflow-hidden bg-white">
        <div className="p-6 border-b border-gray-50">
          <Typography variant="h6" className="font-bold text-gray-800">과거 매매</Typography>
        </div>
        <div className="p-4 space-y-3 flex-grow overflow-y-auto custom-scrollbar bg-gray-50/30">
          {
            pastSales.map((history, i) => {
              return (
                <div key={`${history.ticker}-${history.balance}-${history.date}`}
                     className="flex justify-between items-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all"
                     onClick={() => onHandlerCard({name : history.name, ticker : history.ticker})}>
                  <HistoryCard history={history} />
                </div>
              )
            })
          }
        </div>
      </Card>
      <TradeDetailModal open={open} onClose={onHandlerModal} stockInfo={selectedHistory} />
    </>
  )
}

interface SelectedHistory {
  name : string;
  ticker : string;
}