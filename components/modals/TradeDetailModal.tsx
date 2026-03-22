'use client';

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
import History from './trade-detail/History';
import { StocksDB } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

export default function TradeDetailModal({open, onClose, stockInfo} : Props) {
  const tradeHistory = useLiveQuery(() => {
    return StocksDB.pastSales
          .filter((history) => history.name === stockInfo.name)
          .toArray();
  }, [stockInfo.name]) || [];

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