'use client'

import { Button, Card, Grid, Typography } from '@mui/material'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import { eventBus } from '../modules/modules';
import { Events } from '../modules/events';

export default function SummaryInfo() {
  const onClickCurrecyRateBtn = () => {
    eventBus.emit(Events.SHOW_RATE_MODAL);
  }

  return (
    <>
      <div className="flex justify-between items-end">
        <div>
          <Typography variant="h4" className="font-extrabold text-gray-900 tracking-tight">
            Stock Log
          </Typography>
          <Typography className="text-gray-500 mt-1">매매 내역 및 자산 분석</Typography>
        </div>
        <Button 
          variant="contained" 
          startIcon={<CurrencyExchangeIcon />}
          onClick={onClickCurrecyRateBtn}
          className="bg-white text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 normal-case px-6 py-2 rounded-xl"
        >
          환율 설정
        </Button>
      </div>

      <Grid container spacing={3}>
        {[
          { label: '총 투자 금액', value: '125,000,000', unit: '원', color: 'text-gray-900' },
          { label: '현재 투자 금액', value: '138,500,000', unit: '원', color: 'text-blue-600' },
          { label: '실현 수익률', value: '+12.4', unit: '%', color: 'text-red-500' },
          { label: '누적 배당금', value: '2,450,000', unit: '원', color: 'text-emerald-600' },
        ].map((item, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
            <Card className="shadow-sm border-none rounded-2xl p-5 bg-white">
              <Typography className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                {item.label}
              </Typography>
              <div className="flex items-baseline gap-1">
                <Typography variant="h5" className={`font-black ${item.color}`}>
                  {item.value}
                </Typography>
                <Typography className="text-gray-400 font-medium text-sm">{item.unit}</Typography>
              </div>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}
