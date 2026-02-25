'use client'

import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { Button } from '@mui/material';
import { useState } from 'react';
import ExchangeRateModal from '../modals/ExchangeRateModal';

export default function ExchangeRateBtn() {
  const [open, setOpen] = useState(false);
  const onHandlerClick = () => {
    setOpen(!open);
  }

  return (
    <>
      <Button
        variant="contained" 
        startIcon={<CurrencyExchangeIcon />}
        onClick={onHandlerClick}
        className="bg-white text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 normal-case px-6 py-2 rounded-xl"
      >
        환율 설정
      </Button>
      <ExchangeRateModal open={open} onClose={onHandlerClick}  />
    </>
  )
}
