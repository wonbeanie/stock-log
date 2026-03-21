import { CurrentStockTable, StocksDB } from "@/lib/db";
import { lastHashAtom } from "@/store/excel";
import { useAtomValue } from "jotai";
import { useCallback, useMemo, useState } from "react";

export function useSortedCurrentStocks(){
  const [sortType, setSortType] = useState<string>("name");
  const [orderType, setOrderType] = useState<string>("ASC");
  const lastHash = useAtomValue(lastHashAtom);

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
  }, [sortType, orderType, lastHash]);

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