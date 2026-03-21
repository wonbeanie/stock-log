'use client'

import { PastSale, stockDashboardAtom } from '@/store/stocks';
import { Card, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import HistoryCard from './HistoryCard';
import TradeDetailModal from '@/components/modals/TradeDetailModal';
import { useCallback, useEffect, useState } from 'react';
import PastStocksScrollView from './PastStocksScrollView';
import { StocksDB } from '@/lib/db';
import { lastHashAtom } from '@/store/excel';

export default function PastSalesBoard() {
  const [open, setOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState<SelectedHistory>({
    name : "",
    ticker : ""
  });
  const [pastSales, setPastSales] = useState<PastSale[]>([]);
  const lastHash = useAtomValue(lastHashAtom);
  
  useEffect(()=>{
    async function getData(){
      const pastSales = await StocksDB.pastSales.toArray();
      setPastSales(pastSales);
    }
    getData();
  },[lastHash]);

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