'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import { useAtomCallback } from 'jotai/utils';
import { PastSale, pastSalesAtom } from '@/store/stocks';
import History from './trade-detail/History';
import { StocksDB } from '@/lib/db';

export default function TradeDetailModal({open, onClose, stockInfo} : Props) {
  const [tradeHistory, setTradeHistory] = useState<PastSale[]>([]);

  useEffect(()=>{
    updateHistory();
  },[stockInfo.name]);

  const updateHistory = useCallback(async () => {
    async function getData() {
      const data = await getTradeHistory(stockInfo.name);
      setTradeHistory(data);
    }
    getData();
  }, [stockInfo.name])

  const getTradeHistory = useCallback((stockName : string) => {
    return StocksDB.pastSales.filter((history) => history.name === stockName).toArray();
  }, [])

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
      <DialogTitle className="flex justify-between items-start pt-6">
        <Box>
          <div className="flex items-center">
            <Typography variant="h5" className="font-black text-gray-900">{stockInfo.name}</Typography>
          </div>
          <div className="flex items-center mb-1">
            <Typography variant="caption" className="text-gray-300 font-normal">
              {stockInfo.ticker}
            </Typography>
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

          {tradeHistory.map((history, idx) => (
            <div key={idx} className="relative z-10 flex items-start gap-4">
              <History history={history}/>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
  stockInfo : {
    name : string;
    ticker : string;
  };
}