import { CurrentStockTable, StocksDB } from "@/lib/db";
import { useCallback, useMemo, useState } from "react";

export function useSortedCurrentStocks(){
  const [sortType, setSortType] = useState<string>("name");
  const [orderType, setOrderType] = useState<string>("ASC");

  const sortedCurrentStocks = useMemo(async ()=>{
    let data : CurrentStockTable[] = [];
    if(orderType === "ASC"){
      data = await StocksDB.currentStocks
      .orderBy(sortType)
      .toArray();
    }
    else {
      data = await StocksDB.currentStocks
      .orderBy(sortType)
      .reverse()
      .toArray();
    }

    return data;
  }, [sortType, orderType]);

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