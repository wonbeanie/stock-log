import { StocksPrice } from "@/store/price";
import { CurrentStocks } from "@/store/stocks";
import { CurrentStockTable } from "./db";

export const formatChartData = (
  currentStocks : CurrentStockTable[],
  stocksPrice : StocksPrice,
  exchangeRate = 1450
) => {
  let chartData : ChartData[] = [];
  currentStocks.forEach((stock) => {
    const price = stocksPrice[stock.ticker];

    let valueAmount = price ? price * stock.amount : 0;

    if(valueAmount <= 0){
      return;
    }

    if(stock.country === "US"){
      valueAmount *= exchangeRate;
    }

    const returnRate = Math.round(((valueAmount / stock.amountInput) * 100 - 100) * 100)/100;

    chartData.push({
      profit: valueAmount - stock.amountInput,
      value: returnRate,
      name: stock.name,
      itemStyle: {
        color: returnRate >= 0 ? '#ef4444' : '#3b82f6',
        borderRadius: [0, 4, 4, 0]
      },
      label: {
        show: true,
        position: returnRate >= 0 ? 'right' : 'left',
        formatter: '{c}%'
      }
    });
  });

  chartData.sort((a, b) => a.profit - b.profit);

  const yAxisData = chartData.map(d => d.name);

  return {
    chartData,
    yAxisData
  };
}

export interface ChartData {
  value : number;
  profit: number;
  name: string;
  itemStyle: {
    color: string;
    borderRadius: number[];
  };
  label: {
    show: boolean;
    position: string;
    formatter: string;
  };
}