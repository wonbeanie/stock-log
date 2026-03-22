/// <reference lib="webworker" />

import { StocksPrice } from '@/store/price';
import { CurrentStockTable, StocksDB } from '../db';
import { formatReturnRate } from './price-worker-utils';
import { WorkerMessage, WorkerStatus } from './worker-message';

self.onmessage = async (e) => {
  try{
    const stocksPrice = e.data.payload as StocksPrice;
    const currentStocks = await StocksDB.currentStocks.toArray();
    const newCurrentStocks = currentStocks.map((stock)=>{
      const returnRate = formatReturnRate(stock, stocksPrice, 1450);
      return {
        ...stock,
        returnRate
      }
    }) as CurrentStockTable[];

    await StocksDB.currentStocks.bulkPut(newCurrentStocks);

    self.postMessage(new WorkerMessage(WorkerStatus.DONE, {
      count : currentStocks.length
    }))
  }
  catch(err){
    console.error(err);
    self.postMessage(new WorkerMessage(WorkerStatus.ERROR, null, err));
  }
}