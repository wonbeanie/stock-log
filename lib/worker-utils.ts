import type { excelData } from "./excel";

export const getHash = (data : excelData[]) => {
  if(data.length < 3){
    return `len:${data.length}`;
  }
  const firstTrandedDate = data[1]["거래일자"] + data[2]["거래일자"];
  const lastTrandedDate = data[data.length-2]["거래일자"] + data[data.length-1]["거래일자"];
  
  return `len:${firstTrandedDate}-${lastTrandedDate}-${data.length}`;
}

export const formatDate = (excelDate : string) => {
  return excelDate.replaceAll("(", "").replaceAll(")", "");
}

export const getDateOfPossession = (buyDate : string) => {
  let firstBuy = new Date(buyDate).getTime();
  let nowDate = Date.now();
  let diff = nowDate - firstBuy;
  let diffDays = Math.ceil(diff / (1000 * 3600 * 24));
  return diffDays;
}