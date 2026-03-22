'use client'

import { Grid, Typography } from '@mui/material'
import ExcelUploadButton from './buttons/ExcelUploadButton';
import ServerConfigBtn from './buttons/ServerConfigBtn';
import ExchangeRateBtn from './buttons/ExchangeRateBtn';
import SummaryCard from './summary-info/SummaryCard';
import ServerStatusBadge from './summary-info/ServerStatusBadge';
import { useAtomValue } from 'jotai';
import { isOfflineAtom } from '@/store/baseAtoms';
import { useMemo } from 'react';
import { useSummaryInfo } from '@/hooks/useSummaryInfo';

export default function SummaryInfo() {
  const summaryInfo = useSummaryInfo();
  const isOffline = useAtomValue(isOfflineAtom);

  const summaryItems = useMemo(()=>[
    { label: '총 투자 금액', value: summaryInfo.total, unit: '원', color: 'text-gray-900' },
    { label: '현재 투자 금액', value: summaryInfo.current, unit: '원', color: 'text-blue-600' },
    { label: '실현 수익률', value: summaryInfo.profit, unit: '%', color: 'text-red-500' },
    { label: '누적 배당금', value: summaryInfo.dividend, unit: '원', color: 'text-emerald-600' },
  ], [summaryInfo]);

  return (
    <>
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3">
            <Typography variant="h4" className="font-extrabold text-gray-900 tracking-tight">
              Stock Log
            </Typography>

            <ServerStatusBadge isOffline={isOffline} />
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
        {summaryItems.map(({color, label, value, unit}, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
            <SummaryCard color={color} label={label} unit={unit} value={value}/>
          </Grid>
        ))}
      </Grid>
    </>
  )
}