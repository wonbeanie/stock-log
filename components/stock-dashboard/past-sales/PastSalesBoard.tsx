'use client'

import { Card, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import TradeDetailModal from '@/components/modals/TradeDetailModal';
import { useCallback, useState } from 'react';
import PastStocksScrollView from './PastStocksScrollView';
import { StocksDB } from '@/lib/db';
import { lastHashAtom } from '@/store/excel';
import { useLiveQuery } from 'dexie-react-hooks';

export default function PastSalesBoard() {
  const [open, setOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<SelectedHistory>({
    name : "",
    ticker : ""
  });
  const lastHash = useAtomValue(lastHashAtom);
  const pastSales = useLiveQuery(() => {
    return StocksDB.pastSales.toArray();
  }, [lastHash]) || [];

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
        <PastStocksScrollView data={pastSales} onHandlerCard={onHandlerCard}/>
      </Card>
      <TradeDetailModal open={open} onClose={onHandlerModal} stockInfo={selectedHistory} />
    </>
  )
}

export interface SelectedHistory {
  name : string;
  ticker : string;
}