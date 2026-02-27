'use client'

import { Card, Grid, Typography } from '@mui/material'
import ExcelUploadButton from './buttons/ExcelUploadButton';
import { useAtomValue } from 'jotai';
import ServerConfigBtn from './buttons/ServerConfigBtn';
import ExchangeRateBtn from './buttons/ExchangeRateBtn';
import { summaryOverviewAtom } from '@/store/stocks';
import { isOfflineAtom } from '@/store/baseAtoms';

export default function SummaryInfo() {
  const summary = useAtomValue(summaryOverviewAtom);
  const isOffline = useAtomValue(isOfflineAtom);

  return (
    <>
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3">
            <Typography variant="h4" className="font-extrabold text-gray-900 tracking-tight">
              Stock Log
            </Typography>
            
            {/* 서버 상태 표시 배지 */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
              isOffline 
                ? "bg-gray-50 border-gray-200 text-gray-500" 
                : "bg-green-50 border-green-100 text-green-700"
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                isOffline ? "bg-gray-400" : "bg-green-500 animate-pulse"
              }`} />
              <span className="text-xs font-bold uppercase tracking-wider">
                {isOffline ? "Offline" : "Live"}
              </span>
            </div>
          </div>
          <Typography className="text-gray-500 mt-1">매매 내역 및 자산 분석</Typography>
        </div>
        <div className='flex gap-2'>
          <ServerConfigBtn />
          <ExcelUploadButton />
          <ExchangeRateBtn />
        </div>
      </div>

      <Grid container spacing={3}>
        {[
          { label: '총 투자 금액', value: summary.total, unit: '원', color: 'text-gray-900' },
          { label: '현재 투자 금액', value: summary.current, unit: '원', color: 'text-blue-600' },
          { label: '실현 수익률', value: summary.profit, unit: '%', color: 'text-red-500' },
          { label: '누적 배당금', value: summary.dividend, unit: '원', color: 'text-emerald-600' },
        ].map((item, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
            <Card className="shadow-sm border-none rounded-2xl p-5 bg-white">
              <Typography className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
                {item.label}
              </Typography>
              <div className="flex items-baseline gap-1">
                <Typography variant="h5" className={`font-black ${item.color}`}>
                  {item.value.toLocaleString()}
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
