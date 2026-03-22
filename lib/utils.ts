import type { CurrentStock, CurrentStocks } from "@/store/stocks";
import type { excelData } from "./excel";
import type { PriceInfo, StocksPrice } from "@/store/price";
import { WorkerMessage, WorkerStatus } from "./worker/worker-message";

export const getHash = (data : excelData[]) => {
  if(data.length < 3){
    return `len:${data.length}`;
  }
  const firstTrandedDate = data[1]["거래일자"] + data[2]["거래일자"];
  const lastTrandedDate = data[data.length-2]["거래일자"] + data[data.length-1]["거래일자"];
  
  return `len:${firstTrandedDate}-${lastTrandedDate}-${data.length}`;
}

export const formatTimestamp = (timestamp : number = Date.now()) => {
  if(timestamp === 0){
    return `NO UPDATED`;
  }

  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const formatMonth = String(month).padStart(2, '0');
  const formatDay = String(day).padStart(2, '0');
  const formatHours = String(hours).padStart(2, '0');
  const formatMinutes = String(minutes).padStart(2, '0');
  const formatSeconds = String(seconds).padStart(2, '0');


  return `${year}-${formatMonth}-${formatDay} ${formatHours}:${formatMinutes}:${formatSeconds}`;
}

export const formatReturnRate = (stock : CurrentStock, stocksPrice : StocksPrice, exchangeRate = 1450) => {
  const price = stocksPrice[stock.ticker];

  let valueAmount = price ? price * stock.amount : 0;

  if(valueAmount <= 0){
    return "NO DATA";
  }

  if(stock.country === "US"){
    valueAmount *= exchangeRate;
  }

  const result = (valueAmount / stock.amountInput) * 100 - 100;

  return Math.round(result * 100) / 100;
}

export const updateStocksData = async (files: FileList) : Promise<StocksDataWorkerMessage | null> => {
  try {
    const buffers = await Promise.all(
      Array.from(files).map((file) => file.arrayBuffer())
    )

    return new Promise((resolve, reject) => {
      const worker = new Worker(new URL('./worker/worker.ts', import.meta.url));
      worker.postMessage(new WorkerMessage(WorkerStatus.PROCESS_EXCEL, buffers), buffers);

      worker.onmessage = (e) => {
        if (e.data.type === WorkerStatus.DONE) {
          resolve(e.data.payload as StocksDataWorkerMessage);
          worker.terminate();
        } else if (e.data.type === WorkerStatus.ERROR) {
          reject(e.data.err);
          worker.terminate();
        }
      }

      worker.onerror = (err) => {
        console.error(err);
        reject(err);
        worker.terminate();
      }
    });
  }
  catch(err){
    console.error(err);
    return null;
  }
}

export const updateExchangeRatio = async (exchangeRate : number) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./worker/worker.ts', import.meta.url));
    worker.postMessage(new WorkerMessage(WorkerStatus.EXCHANGE_RATIO, exchangeRate));

    worker.onmessage = (e) => {
      resolve(e.data);
      worker.terminate();
    }
  })
}

export const updateCurrentStocksPrice = async (priceInfo : PriceInfo) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./worker/price-worker.ts', import.meta.url));
    worker.postMessage(new WorkerMessage(WorkerStatus.PROCESS_PRICE, priceInfo.stocksPrice));

    worker.onmessage = (e) => {
      resolve(e.data);
      worker.terminate();
    }
  })
}

export const formatCurrentStocksPrice = (
  currentStocks : CurrentStocks, stocksPrice : StocksPrice, exchangeRate : number
) => {
  let result : CurrentStocks = {};
  Object.entries(currentStocks).forEach(([name, stocks])=>{
    const returnRate = formatReturnRate(stocks, stocksPrice, exchangeRate);
    result[name] = {
      ...stocks,
      returnRate
    }
  });

  return result;
}

interface StocksDataWorkerMessage {
  newHash : string;
}