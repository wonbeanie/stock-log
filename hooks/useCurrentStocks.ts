import { CurrentStock, stockDashboardAtom } from "@/store/stocks";
import { useAtomValue } from "jotai";
import { useCallback, useMemo, useState } from "react";

export function useSortedCurrentStocks(){
  const {currentStocks} = useAtomValue(stockDashboardAtom);
  const [sortType, setSortType] = useState<string>("stockName");
  const [orderType, setOrderType] = useState<string>("ASC");

  const sorting = useMemo(()=>{
    return sortingSetting(sortType, orderType);
  }, [sortType, orderType])

  const sortedCurrentStocks = useMemo(()=>{
    return Object.entries(currentStocks).sort(sorting);
  }, [currentStocks, sorting]);

  const onHandlerSort = useCallback((type : string) => {
    return (e : React.MouseEvent<HTMLTableCellElement>) => {
      e.preventDefault();
      if(sortType === type){
          orderType === "ASC" ? setOrderType("DESC") : setOrderType("ASC");
          return;
      }
      setSortType(type);
    }
  }, [sortType, orderType]);

  return {
    sortedCurrentStocks,
    onHandlerSort,
  };
}

function sortingSetting(
  sortType : string,
  orderType : string,
){
  return (
    [aName, aStock] : [string, CurrentStock],
    [bName, bStock] : [string, CurrentStock]
  ) => {
    if(sortType === "stockName"){
      if(orderType === "DESC"){
        return bName.localeCompare(aName);
      }
      return aName.localeCompare(bName);
    }
    if(sortType === "dateOfPossession"){
      if(orderType === "DESC"){
        return bStock.dateOfPossession - aStock.dateOfPossession;
      }
      return aStock.dateOfPossession - bStock.dateOfPossession;
    }
    if(sortType === "amountInput"){
      if(orderType === "DESC"){
        return bStock.amountInput - aStock.amountInput;
      }
      return aStock.amountInput - bStock.amountInput;
    }
    if(sortType === "returnRate"){
      if(aStock.returnRate === "NO DATA"){
        return 1;
      }
      if(bStock.returnRate === "NO DATA"){
        return -1;
      }

      if(orderType === "DESC"){
        return bStock.returnRate - aStock.returnRate;
      }
      return aStock.returnRate - bStock.returnRate;
    }

    return 0;
  }
}