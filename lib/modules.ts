import { StocksPrice } from "@/store/price";
import { CurrentStock } from "@/store/stocks";

export const formatDate = (timestamp : number = new Date().getTime()) => {
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

  const formatMonth = month < 10 ? '0' + month : month;
  const formatDay = day < 10 ? '0' + day : day;
  const formatHours = hours < 10 ? '0' + hours : hours;
  const formatMinutes = minutes < 10 ? '0' + minutes : minutes;
  const formatSeconds = seconds < 10 ? '0' + seconds : seconds;


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

  return result;
}