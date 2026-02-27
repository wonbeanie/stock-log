'use client'

import { formatDate } from '@/lib/utils';
import { exchangeRateAtom, stocksPriceAtom } from '@/store/price';
import { stockDashboardAtom } from '@/store/stocks';
import { Card, Chip, Typography } from '@mui/material'
import ReactECharts from 'echarts-for-react';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';

export default function RateOfReturnBarChart() {
  const {stocksPrice, updateDate} = useAtomValue(stocksPriceAtom);
  const {currentStocks} = useAtomValue(stockDashboardAtom);
  const exchangeRate = useAtomValue(exchangeRateAtom);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(()=>{
    formatChartData();
  },[stocksPrice, exchangeRate, currentStocks]);

  const formatChartData = () => {
    let chartData : ChartData[] = [];
    Object.entries(currentStocks).forEach(([stockName, stock]) => {
      const price = stocksPrice[stock.ticker];

      let valueAmount = price ? price * stock.amount : 0;
      const shortName = stockName.slice(0, 5) + "...";

      if(valueAmount <= 0){
        return;
      }

      if(stock.country === "US"){
        valueAmount *= exchangeRate;
      }

      const returnRate = Math.round(((valueAmount / stock.amountInput) * 100 - 100) * 100)/100;
      
      chartData.push({
        value : returnRate,
        profit : valueAmount - stock.amountInput,
        name : stockName,
        shortName
      });
    });

    chartData.sort((a, b) => a.profit - b.profit);

    setChartData(chartData);
  }

  const options = useMemo(() => ({
    grid: { left: '3%', right: '8%', bottom: '3%', top: '3%', containLabel: true },
    xAxis: {
      type: 'value',
      axisLabel: { formatter: '{value}%' },
      splitLine: { lineStyle: { type: 'dashed' } }
    },
    yAxis: {
      type: 'category',
      data: chartData.map(d => d.shortName),
      axisLine: { show: false },
      axisTick: { show: false },
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params : any) {
        const data = params[0].data;
        const profitText = data.profit.toLocaleString();
        const color = data.value >= 0 ? '#ef4444' : '#3b82f6';

        return `
          <div style="margin-bottom: 4px; font-weight: bold;">${data.name}</div>
          <div style="display: flex; justify-content: space-between; gap: 10px;">
            <span>수익률:</span>
            <span style="color: ${color}; font-weight: bold;">${data.value}%</span>
          </div>
          <div style="display: flex; justify-content: space-between; gap: 10px;">
            <span>수익금:</span>
            <span style="font-weight: bold;">${profitText}원</span>
          </div>
        `;
      }
    },
    series: [
      {
        name: '수익률',
        type: 'bar',
        data: chartData.map(d => ({
          profit: d.profit,
          value: d.value,
          name: d.name,
          shortName : d.shortName,
          itemStyle: {
            color: d.value >= 0 ? '#ef4444' : '#3b82f6',
            borderRadius: [0, 4, 4, 0]
          },
          label: {
            show: true,
            position: d.value >= 0 ? 'right' : 'left',
            formatter: '{c}%'
          }
        })),
      },
    ],
  }), [chartData]);

  return (
    <Card className="shadow-xl border-none rounded-3xl p-6 bg-white">
      <div className="flex justify-between items-center mb-6">
        <Typography className="font-black text-gray-800">현재 보유 주식 수익률</Typography>
        <Chip label={`Last updated: ${formatDate(updateDate)}`} size="small" variant="outlined" className="text-gray-400 border-gray-200" />
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

interface ChartData {
  value : number;
  profit: number;
  name: string;
  shortName: string;
}