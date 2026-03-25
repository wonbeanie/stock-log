/// <reference lib="webworker" />

import { read, utils } from 'xlsx';
import { clear, get, set } from 'idb-keyval';
import { processExcelData } from '../excel';
import type { excelData } from '../excel';
import { StocksDB, SUMMARY_INFO_KEYS } from '../db';
import type { StocksData } from '@/lib/type/stocks';
import { getHash } from './worker-utils';
import { WorkerMessage, WorkerStatus } from './worker-message';

self.onmessage = async (e) => {
  try{
    let data : excelData[] = [];
    let stocksData : StocksData = {} as StocksData;
    let newHash = "";

    if(e.data.type === WorkerStatus.PROCESS_EXCEL){
      const buffers = e.data.payload as ArrayBuffer[];
      if (!buffers) return;
      let combinedData = [];
      for (const buffer of buffers) {
        const wb = read(buffer, {type:'array'});
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = utils.sheet_to_json(ws).slice(1) as excelData[];
        combinedData.push(data); 
      }
      data = combinedData.flat();
      newHash = getHash(data);
      await clear();
      await set('EXCEL_DATA', data);
      await set('LAST_HASH', newHash);
      stocksData = processExcelData(data);
    }
    else {
      data = await get('EXCEL_DATA') || [];
      const exchangeRate = e.data.payload;
      stocksData = processExcelData(data, exchangeRate);
    }

    if(!StocksDB.isOpen()){
      await StocksDB.open();
    }

    await Promise.all([
      StocksDB.summaryInfo.clear(),
      StocksDB.currentStocks.clear(),
      StocksDB.pastSales.clear(),
    ]);

    const {currentStocks, pastSales, ...summaryInfo} = stocksData;

    await StocksDB.summaryInfo.add({ id : SUMMARY_INFO_KEYS.TOTAL, value : summaryInfo.totalInvestment});
    await StocksDB.summaryInfo.add({ id : SUMMARY_INFO_KEYS.CURRENT, value : summaryInfo.currentInvestment});
    await StocksDB.summaryInfo.add({ id : SUMMARY_INFO_KEYS.PROFIT, value : summaryInfo.realizedProfit});
    await StocksDB.summaryInfo.add({ id : SUMMARY_INFO_KEYS.DIVIDEND, value : summaryInfo.dividend});

    await StocksDB.currentStocks.bulkAdd(Object.values(stocksData.currentStocks));
    await StocksDB.pastSales.bulkAdd(stocksData.pastSales);
    self.postMessage(new WorkerMessage(WorkerStatus.DONE, {
      newHash
    }))
  }
  catch(err){
    console.error(err);
    self.postMessage(new WorkerMessage(WorkerStatus.ERROR, null, err));
  }
}