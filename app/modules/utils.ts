import { CurrentStock, PastSale } from "../store/atoms";

export const processExcelData = (jsonData : excelData[]) => {
  const result: StockHistory[] = [];

  for(let i = 1; i < jsonData.length; i += 2){
    const firstData = jsonData[i] as OddLineData;
    const secondData = jsonData[i+1] as EvenLineData;

    if(!jsonData[i] || !jsonData[i+1]){
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

  return formatStocks(result);
}

export const formatStocks = (data : StockHistory[]) => {
  let totalInvestmenet = 0;
  let currentInvestment = 0;
  let dividend = 0;
  let realizedProfit = 0;
  
  let currentStocks : {[name : string] : CurrentStock} = {};
  let pastSales : PastSale[] = [];

  let exchangeRate = 1450;
  let currentNames = new Set();
  
  data.sort(dateSort()).forEach((history) => {
    if(history["상세내용"].includes("배당금") || history["상세내용"].includes("분배금")){
      let dividendTemp = history["거래금액"];
      if(history["상세내용"].includes("외화")){
        dividendTemp *= exchangeRate;
      }
      dividend += dividendTemp;
    }

    if(history["거래유형"].includes("매수")){
      let tradedPrice = history["거래금액"];
      if(history["상세내용"].includes("외화")){
        tradedPrice *= exchangeRate;
      }
      totalInvestmenet += tradedPrice;
      currentInvestment += tradedPrice;
      pastSales.push({
        name : history["종목명"],
        type : history["거래유형"],
        date : history["거래일자"],
        profits : tradedPrice
      });
      if(!currentNames.has(history["종목명"])){
        currentNames.add(history["종목명"]);
        currentStocks[history["종목명"]] = {
          name : history["종목명"],
          ticker : history["종목코드"],
          dateOfPossession : calDateOfPossession(history["거래일자"]),
          amountInput : tradedPrice,
          ratio : 0
        }
      }
      else {
        currentStocks[history["종목명"]].amountInput += tradedPrice;
      }
    }

    // 분할 매도는 계산이 안됨
    if(history["거래유형"].includes("매도")){
      let tradedPrice = history["거래금액"];
      let profits = 0;
      if(history["상세내용"].includes("외화")){
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
        profits
      });
    }
  })

  currentStocks = Object.fromEntries(
    Object.entries(currentStocks).map(([key, value])=>{
      const ratio = Math.round(
        ((value.amountInput / currentInvestment) * 100) * 100
      ) / 100;
      
      return [key, {
        ...value,
        ratio
      }]
    })
  );

  realizedProfit = (realizedProfit / totalInvestmenet) * 100;

  pastSales.sort(dateSort("desc"));

  return {
    totalInvestmenet,
    currentInvestment,
    dividend,
    realizedProfit,
    currentStocks,
    pastSales
  }
}

const calDateOfPossession = (buyDate : string) => {
  let firstBuy = new Date(buyDate).getTime();
  let nowDate = new Date().getTime();
  let diff = nowDate - firstBuy;
  let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
  return diffDays;
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
            
interface FormatEvenLineData {
  "정산금액" : number;
  "거래일자" : string;
  "단가" : number;
  "세금" : number;
  "변제금" : number;
  "이자" : number;
  "잔고금액" : number;
  "종목코드" : string;
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