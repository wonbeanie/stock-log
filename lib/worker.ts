/// <reference lib="webworker" />

import { read, utils } from 'xlsx';
import { clear, get, set } from 'idb-keyval';
import { processExcelData } from './excel';
import type { excelData } from './excel';
import { StocksDB } from './db';
import type { StocksData } from '../store/stocks';
import { getHash } from './worker-utils';

self.onmessage = async (e) => {
  try{
    let data : excelData[] = [];
    let stocksData : StocksData = {} as StocksData;

    let test = "";

    if(typeof e.data !== "number"){
      const { buffers } = e.data as { buffers: ArrayBuffer[] };
      if (!buffers) return;
      let combinedData = [];
      for (const buffer of buffers) {
        const wb = read(buffer, {type:'array'});
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = utils.sheet_to_json(ws).slice(1) as excelData[];
        combinedData.push(data); 
      }
      data = combinedData.flat();
      const newHash = getHash(data);
      await clear();
      await set('EXCEL_DATA', data);
      await set('LAST_HASH', newHash);
      stocksData = processExcelData(data);
    }
    else {
      data = await get('EXCEL_DATA') || [];
      const exchangeRate = e.data;
      stocksData = processExcelData(data, exchangeRate);
    }

    if(!StocksDB.isOpen()){
      await StocksDB.open();
    }

    await Promise.all([
      StocksDB.totalInvestment.clear(),
      StocksDB.currentInvestment.clear(),
      StocksDB.realizedProfit.clear(),
      StocksDB.dividend.clear(),
      StocksDB.currentStocks.clear(),
      StocksDB.pastSales.clear(),
    ]);

    await StocksDB.totalInvestment.add({ id: 'main', value: stocksData.totalInvestment });
    await StocksDB.currentInvestment.add({ id: 'main', value: stocksData.currentInvestment });
    await StocksDB.realizedProfit.add({ id: 'main', value: stocksData.realizedProfit });
    await StocksDB.dividend.add({ id: 'main', value: stocksData.dividend });

    await StocksDB.currentStocks.bulkAdd(Object.values(stocksData.currentStocks));
    await StocksDB.pastSales.bulkAdd(stocksData.pastSales);
    self.postMessage({ type : 'DONE', count : data.length, log : test});
  }
  catch(err){
    console.error(err);
    self.postMessage({ type : 'ERROR', err});
  }
}