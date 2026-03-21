'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  InputAdornment,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { useAtomValue, useSetAtom } from 'jotai';
import { exchangeRateAtom, updateExchangeRatioAtom } from '@/store/price';

export default function ExchangeRateModal({open, onClose} : Props) {
  const exchangeRate = useAtomValue(exchangeRateAtom);
  const [rate, setRate] = useState<number>(exchangeRate);
  const [blurCheck, setBlurCheck] = useState<boolean>(true);
  const updateExchangeRatio = useSetAtom(updateExchangeRatioAtom);

  const handleSave = async () => {
    await updateExchangeRatio(rate);
    onClose();
  };

  const handleRateChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "");

    setRate(Number(value));
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          className: "rounded-2xl p-2",
        },
      }}
    >
      <DialogTitle className="flex justify-between items-center border-b pb-4">
        <div className="flex items-center gap-2">
          <CurrencyExchangeIcon className="text-blue-600" />
          <Typography variant="h6" className="font-bold">환율 설정</Typography>
        </div>
        <Button onClick={onClose} className="min-w-0 p-1 text-gray-400">
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent className="py-6">
        <Box className="space-y-4 mt-2">
          <TextField
            fullWidth
            label="USD/KRW 환율"
            variant="outlined"
            type="text"
            value={blurCheck ? rate.toLocaleString() : rate}
            onFocus={()=>setBlurCheck(false)}
            onBlur={()=>setBlurCheck(true)}
            onChange={handleRateChange}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start">₩</InputAdornment>,
                endAdornment: <InputAdornment position="end">/ $</InputAdornment>,
                className: "font-bold text-lg"
              }
            }}
          />
          <Typography variant="caption" className="text-gray-500">
            현재 적용된 환율을 바탕으로 해외 주식 자산이 원화로 계산됩니다.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions className="p-4 pt-0">
        <Button 
          onClick={onClose} 
          className="text-gray-500 font-bold px-6"
        >
          취소
        </Button>
        <Button 
          onClick={handleSave}
          variant="contained" 
          className="bg-blue-600 hover:bg-blue-700 shadow-none px-8 rounded-xl font-bold"
        >
          적용하기
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
}