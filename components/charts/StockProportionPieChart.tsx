import ReactECharts from 'echarts-for-react';
import { useEffect, useMemo, useState } from 'react';
import { Card, Typography } from '@mui/material';
import { StocksDB } from '@/lib/db';
import { useAtomValue } from 'jotai';
import { lastHashAtom } from '@/store/excel';

export default function StockProportionPieChart() {
  const [pieData, setPieData] = useState<PieData[]>([]);
  const lastHash = useAtomValue(lastHashAtom);

  useEffect(()=>{
    async function getData(){
      const data = (await StocksDB.currentStocks
          .orderBy('amountInput')
          .reverse()
          .toArray()
        ).map((stock) => {
          return {
            name: stock.name,
            value: stock.amountInput
          }
        })
      setPieData(data);
    }
    getData();
  },[lastHash]);

  const currentStocksOption = useMemo(()=>{
    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}({d}%)'
      },
      series: [
        {
          name: '자산 비중',
          type: 'pie',
          radius: '60%', // 차트 크기
          center: ['50%', '50%'], // 차트 중심 위치
          data: pieData,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    }
  }, [pieData]);

  return (
    <Card className="shadow-xl border-none rounded-3xl p-6 bg-white">
      <Typography className="font-black text-gray-800 mb-6">현재 보유 종목 비중</Typography>
      <div className="h-[400px] w-full bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center">
        <ReactECharts 
          option={currentStocksOption} 
          style={{ height: '100%', width: '100%' }} 
        />
      </div>
    </Card>
  )
}

interface PieData {
  name: string;
  value: number;
}