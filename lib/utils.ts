import { CurrentStock, CurrentStocks, StocksData } from "@/store/stocks";
import { excelData } from "./excel";
import { PriceInfo, StocksPrice } from "@/store/price";
import * as XLSX from 'xlsx';

export const getHash = (data : excelData[]) => {
  if(data.length < 3){
    return `len:${data.length}`;
  }
  const firstTrandedDate = data[1]["거래일자"] + data[2]["거래일자"];
  const lastTrandedDate = data[data.length-2]["거래일자"] + data[data.length-1]["거래일자"];
  
  return `len:${firstTrandedDate}-${lastTrandedDate}-${data.length}`;
}

export const getDateOfPossession = (buyDate : string) => {
  let firstBuy = new Date(buyDate).getTime();
  let nowDate = Date.now();
  let diff = nowDate - firstBuy;
  let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
  return diffDays;
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

export const formatDate = (excelDate : string) => {
  return excelDate.replaceAll("(", "").replaceAll(")", "");
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

export const readFilesAsBuffer = async (files : FileList) => {
  const promises = Array.from(files).map((file) => {
    return new Promise((resolve)=>{
      const reader = new FileReader();
    
      reader.onload = (evt) => {
        const data = evt.target?.result;
        if (!data) return;

        const wb = XLSX.read(data, { type: 'array' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        const excelData = XLSX.utils.sheet_to_json(ws).slice(1) as excelData[];
        resolve(excelData)
      };

      reader.readAsArrayBuffer(file);
    }) as Promise<excelData[]>;
  })

  try {
    const results = await Promise.all(promises);
    return results;
  }
  catch (err) {
    console.log(err);
    return [];
  }
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