'use client'

import { formatChartData } from '@/lib/chart';
import { formatTimestamp } from '@/lib/utils';
import { exchangeRateAtom, stocksPriceAtom } from '@/store/price';
import { stockDashboardAtom } from '@/store/stocks';
import { Card, Chip, Typography } from '@mui/material'
import ReactECharts from 'echarts-for-react';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import ToolTip from './ToolTip';
import ReactDOMServer from 'react-dom/server';
import { CurrentStockTable, StocksDB } from '@/lib/db';

export default function RateOfReturnBarChart() {
  const {stocksPrice, updateDate} = useAtomValue(stocksPriceAtom);
  const exchangeRate = useAtomValue(exchangeRateAtom);
  const [currentStocks, setCurrentStocks] = useState<CurrentStockTable[]>([]);

  useEffect(()=>{
    async function getData(){
      const data = (
        await StocksDB.currentStocks
        .orderBy('amountInput')
        .reverse()
        .toArray()
      );
      
      setCurrentStocks(data);
    }
    getData();
  }, []);

  const {chartData, options} = useMemo(()=>{
    const {chartData, yAxisData} = formatChartData(currentStocks, stocksPrice, exchangeRate);
    const options = {
      grid: { left: '3%', right: '8%', bottom: '3%', top: '3%', containLabel: true },
      xAxis: {
        type: 'value',
        axisLabel: { formatter: '{value}%' },
        splitLine: { lineStyle: { type: 'dashed' } }
      },
      yAxis: {
        type: 'category',
        data: yAxisData,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          formatter: (value : string) => {
            return value.length > 5 ? value.slice(0, 5)+"..." : value;
          }
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params : any) => {
          const data = params[0].data;
          return ReactDOMServer.renderToString(<ToolTip data={data} />);
        },
      },
      series: [
        {
          name: '수익률',
          type: 'bar',
          data: chartData,
        },
      ],
    };
    return {chartData, options};
  },[currentStocks, stocksPrice, exchangeRate]);

  return (
    <Card className="shadow-xl border-none rounded-3xl p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <Typography className="font-black text-gray-800">현재 보유 주식 수익률</Typography>
        <Chip label={`Last updated: ${formatTimestamp(updateDate)}`} size="small" variant="outlined" className="text-gray-400 border-gray-200" />
      </div>
      <div className="h-[400px] w-full bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center">
        {
          chartData.length === 0 ?
            <Typography className="text-black-300 font-medium">SERVER OFFLINE</Typography>
          :
            <ReactECharts 
              option={options} 
              style={{ height: '100%', width: '100%' }} 
            />
        }
      </div>
    </Card>
  )
}