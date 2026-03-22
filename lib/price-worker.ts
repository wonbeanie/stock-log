/// <reference lib="webworker" />

import { StocksPrice } from '@/store/price';
import { CurrentStockTable, StocksDB } from './db';
import { formatReturnRate } from './price-worker-utils';

self.onmessage = async (e) => {
  try{
    const stocksPrice = e.data.stocksPrice as StocksPrice;
    const currentStocks = await StocksDB.currentStocks.toArray();
    const newCurrentStocks = currentStocks.map((stock)=>{
      const returnRate = formatReturnRate(stock, stocksPrice, 1450);
      return {
        ...stock,
        returnRate
      }
    }) as CurrentStockTable[];

    await StocksDB.currentStocks.bulkPut(newCurrentStocks);

    self.postMessage({ type : 'DONE', count : currentStocks.length});
  }
  catch(err){
    console.error(err);
    self.postMessage({ type : 'ERROR', err});
  }
}