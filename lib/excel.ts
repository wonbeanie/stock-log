import { CurrentStocks, PastSale, StocksData } from "@/store/stocks";
import { getDateOfPossession } from "./utils";

export const processExcelData = (excelData : excelData[], exchangeRate = 1450) => {
  const result = formatExcelData(excelData);
  return formatStocks(result, exchangeRate);
}

const formatExcelData = (excelData : excelData[]) => {
  let result: StockHistory[] = [];

  for(let i = 0; i < excelData.length; i += 2){
    const firstData = excelData[i] as OddLineData;
    const secondData = excelData[i+1] as EvenLineData;

    if(!excelData[i] || !excelData[i+1]){
        continue;
    }

    const stockHistory : StockHistory = {
      ...firstData,
      "종목코드": secondData["종목명"],
      "단가": secondData["수량"],
      "정산금액": secondData["거래금액"],
      "잔고금액": secondData["잔고"],
      "이자": secondData["이율"],
      "세금": secondData["수수료"],
      "변제금": secondData["연체료"],
      "거래일자": `${firstData["거래일자"]} ${secondData["거래일자"]}`
    }

    result.push(stockHistory);
  }

  return result;
}

const formatStocks = (data : StockHistory[], exchangeRate = 1450) : StocksData => {
  let realizedProfit = 0;
  let totalInvestment = 0;
  let currentInvestment = 0;
  let dividend = 0;
  let currentStocks : CurrentStocks = {};
  let pastSales : PastSale[] = [];

  let currentNames = new Set();
  data.sort(dateSort()).forEach((history) => {
    const isForeign = history["상세내용"].includes("외화");

    const isDividend = history["상세내용"].includes("배당금") || history["상세내용"].includes("분배금");
    if(isDividend){
      let dividendTemp = history["거래금액"];
      if(isForeign){
        dividendTemp *= exchangeRate;
      }
      dividend += dividendTemp;
    }

    const isBuy = history["거래유형"].includes("매수");
    if(isBuy){
      let tradedPrice = history["거래금액"];
      if(isForeign){
        tradedPrice *= exchangeRate;
      }
      totalInvestment += tradedPrice;
      currentInvestment += tradedPrice;
      pastSales.push({
        name : history["종목명"],
        type : history["거래유형"],
        date : history["거래일자"],
        amount : history["수량"],
        profits : tradedPrice
      });

      const isFirstBuy = !currentNames.has(history["종목명"]);
      if(isFirstBuy){
        currentNames.add(history["종목명"]);

        const country = history["종목코드"].slice(0,2) === "US" ? "US" : "KR";

        currentStocks[history["종목명"]] = {
          name : history["종목명"],
          ticker : history["종목코드"],
          dateOfPossession : getDateOfPossession(history["거래일자"]),
          amountInput : tradedPrice,
          amount : history["수량"],
          country
        }
      }
      else {
        currentStocks[history["종목명"]].amountInput += tradedPrice;
        currentStocks[history["종목명"]].amount += history["수량"];
      }
    }

    // 분할 매도는 계산이 안됨
    const isSell = history["거래유형"].includes("매도");
    if(isSell){
      let tradedPrice = history["거래금액"];
      let profits = 0;
      if(isForeign){
        tradedPrice *= exchangeRate;
      }

      if(currentNames.has(history["종목명"])){
        currentInvestment -= currentStocks[history["종목명"]].amountInput;
        profits = tradedPrice - currentStocks[history["종목명"]].amountInput;
        realizedProfit += profits;

        if(history["잔고"] <= 0){
          currentNames.delete(history["종목명"]);
          delete currentStocks[history["종목명"]];
        }
        else {
          currentStocks[history["종목명"]].amountInput -= tradedPrice;
        }
      }

      pastSales.push({
        name : history["종목명"],
        type : history["거래유형"],
        date : history["거래일자"],
        amount : history["수량"],
        profits
      });
    }
  })

  realizedProfit = totalInvestment - currentInvestment > 0 ?
                   (realizedProfit / (totalInvestment - currentInvestment)) * 100 :
                   0

  pastSales.sort(dateSort("desc"));

  return {
    totalInvestment,
    currentInvestment,
    dividend,
    realizedProfit,
    currentStocks,
    pastSales
  }
}

const dateSort = (type = "asc") => {
  const cache = new Map<string, number>();
  return (a : StockHistory | PastSale, b : StockHistory | PastSale) => {
    const valA = "거래일자" in a ? a["거래일자"] : a.date;
    const valB = "거래일자" in b ? b["거래일자"] : b.date;

    if (!cache.has(valA)) cache.set(valA,new Date(valA).getTime());
    if (!cache.has(valB)) cache.set(valB,new Date(valB).getTime());
    
    return type === "desc" ?
    cache.get(valB)! - cache.get(valA)! :
    cache.get(valA)! - cache.get(valB)!
  }
}

export type excelData = OddLineData | EvenLineData;

interface OddLineData {
  "거래금액" : number;
  "거래유형" : string;
  "거래일자" : string;
  "상세내용" : string;
  "수량" : number;
  "수수료" : number;
  "실거래일자" : string;
  "연체료" : number;
  "이율" : number;
  "잔고" : number;
  "종목명" : string;
}

interface EvenLineData {
  "거래금액" : number;
  "거래일자" : string;
  "수량" : number;
  "수수료" : number;
  "연체료" : number;
  "이율" : number;
  "잔고" : number;
  "종목명" : string;
}

interface StockHistory {
  "거래금액" : number;
  "거래유형" : string;
  "거래일자" : string;
  "단가" : number;
  "변제금" : number;
  "상세내용" : string;
  "세금" : number;
  "수량" : number;
  "수수료" : number;
  "실거래일자" : string;
  "연체료" : number;
  "이율" : number;
  "이자" : number;
  "잔고" : number;
  "잔고금액" : number;
  "정산금액" : number;
  "종목명" : string;
  "종목코드" : string;
}