'use client'

import { Grid, Typography } from '@mui/material'
import ExcelUploadButton from './buttons/ExcelUploadButton';
import ServerConfigBtn from './buttons/ServerConfigBtn';
import ExchangeRateBtn from './buttons/ExchangeRateBtn';
import SummaryCard from './summary-info/SummaryCard';
import ServerStatusBadge from './summary-info/ServerStatusBadge';
import { useAtomValue } from 'jotai';
import { isOfflineAtom } from '@/store/baseAtoms';
import { useEffect, useMemo, useState } from 'react';
import { StocksDB } from '@/lib/db';
import { lastHashAtom } from '@/store/excel';

export default function SummaryInfo() {
  const [summaryOverview, setSummaryOverview] = useState<SummaryOverview>({
    total: 0,
    current: 0,
    profit: 0,
    dividend: 0
  });
  const isOffline = useAtomValue(isOfflineAtom);
  const lastHash = useAtomValue(lastHashAtom);

  useEffect(()=>{
    function getSummaryOverview(){
      return new Promise(async (resolve, reject)=>{
        const totalInvestment = StocksDB.totalInvestment.toArray();
        const currentInvestment = StocksDB.currentInvestment.toArray();
        const realizedProfit = StocksDB.realizedProfit.toArray();
        const dividend = StocksDB.dividend.toArray();

        const data = await Promise.all([totalInvestment, currentInvestment, realizedProfit, dividend]);

        const summaryOverview = Object.fromEntries(
          data.map((item)=> [item[0].key, item[0].value]
        ))

        resolve(summaryOverview);
      });
    }

    async function getData(){      
      const data = await getSummaryOverview() as SummaryOverview;
      setSummaryOverview(data);
    }
    getData();
  }, [lastHash]);

  const summaryItems = useMemo(()=>[
    { label: '총 투자 금액', value: summaryOverview.total, unit: '원', color: 'text-gray-900' },
    { label: '현재 투자 금액', value: summaryOverview.current, unit: '원', color: 'text-blue-600' },
    { label: '실현 수익률', value: summaryOverview.profit, unit: '%', color: 'text-red-500' },
    { label: '누적 배당금', value: summaryOverview.dividend, unit: '원', color: 'text-emerald-600' },
  ], [summaryOverview]);

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


interface SummaryOverview {
  total: number;
  current: number;
  profit: number;
  dividend: number;
}