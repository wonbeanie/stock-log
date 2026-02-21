'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Chip,
  Divider,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import { eventBus } from '../modules/modules';
import { Events } from '../modules/events';

interface TradeRecord {
  date: string;
  type: '매수' | '매도';
  price: number;
  amount: number;
}

export default function TradeDetailModal() {
  const [open, setOpen] = useState<boolean>(false);
  const [stockName, setStockName] = useState<string>('Apple Inc.');
  const [ticker, setTicker] = useState<string>('AAPL');
  const [tradeHistory, setTradeHistory] = useState<TradeRecord[]>(
    [
      { date: '2026.02.10', type: '매수', price: 245000, amount: 10 },
      { date: '2026.01.15', type: '매수', price: 230000, amount: 5 },
      { date: '2025.12.20', type: '매도', price: 260000, amount: 2 },
    ]
  );

  useEffect(()=>{
    eventBus.on(Events.SHOW_DETAIL_MODAL, onOpen);
    eventBus.on(Events.HIDE_DETAIL_MODAL, onClose);
  });

  const onOpen = () => {
    setOpen(true);
  }

  const onClose = () => {
    setOpen(false);
  }

  return (
    <Dialog 
      open={open} 
      onClose={() => onClose()}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          className: "rounded-3xl p-2",
        },
      }}
    >
      {/* 헤더: 종목명과 티커 */}
      <DialogTitle className="flex justify-between items-start pt-6">
        <Box>
          <div className="flex items-center gap-2 mb-1">
            <Typography variant="h5" className="font-black text-gray-900">{stockName}</Typography>
            <Typography className="text-gray-400 font-medium">{ticker}</Typography>
          </div>
          <Typography variant="caption" className="text-blue-600 font-bold flex items-center gap-1">
            <HistoryIcon sx={{ fontSize: 14 }} /> 전체 매매 히스토리
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small" className="text-gray-400">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent className="pb-8">
        <div className="mt-4 space-y-6 relative">
          <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gray-100 z-0" />

          {tradeHistory.map((trade, idx) => (
            <div key={idx} className="relative z-10 flex items-start gap-4">
              <div className={`w-[24px] h-[24px] rounded-full border-4 border-white shadow-sm flex-shrink-0 ${
                trade.type === '매수' ? 'bg-red-500' : 'bg-blue-500'
              }`} />
              
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <Typography className="text-sm font-bold text-gray-800">
                    {trade.type} {trade.amount}주
                  </Typography>
                  <Typography className="text-[11px] text-gray-400 font-medium">
                    {trade.date}
                  </Typography>
                </div>
                <Typography className="text-xs text-gray-500">
                  체결가: <span className="font-semibold text-gray-700">₩{trade.price.toLocaleString()}</span>
                </Typography>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}