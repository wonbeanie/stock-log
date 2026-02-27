import ReactECharts from 'echarts-for-react';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { Card, Typography } from '@mui/material';
import { stockDashboardAtom } from '@/store/stocks';

export default function StockProportionPieChart() {
  const {currentStocks} = useAtomValue(stockDashboardAtom);
  const [currentStocksOption, setCurrentStocksOption] = useState({});

  useEffect(()=>{
    initPieChat();
  },[]);

  const initPieChat = () => {
    const pieData = Object.entries(currentStocks).map(([stockName, stock]) => {
      return {
        name: stockName,
        value: stock.amountInput
      }
    }).sort((a, b) => b.value - a.value);

    setCurrentStocksOption({
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
    })
  }

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
