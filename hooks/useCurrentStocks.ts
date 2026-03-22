import { CurrentStockTable, StocksDB } from "@/lib/db";
import { lastHashAtom } from "@/store/excel";
import { useLiveQuery } from "dexie-react-hooks";
import { useAtomValue } from "jotai";
import { useCallback, useMemo, useState } from "react";

export function useSortedCurrentStocks(){
  const [sortType, setSortType] = useState<string>("name");
  const [orderType, setOrderType] = useState<string>("ASC");
  const lastHash = useAtomValue(lastHashAtom);
  const sortedCurrentStocks = useLiveQuery(() => {
    let query = StocksDB.currentStocks.orderBy(sortType);
    if(orderType === "DESC"){
      query.reverse()
    }

    return query.toArray();
  }, [sortType, orderType, lastHash]) || [];

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