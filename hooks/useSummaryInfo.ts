import { StocksDB, SUMMARY_INFO_KEYS } from "@/lib/db";
import { lastHashAtom } from "@/store/excel";
import { useLiveQuery } from "dexie-react-hooks";
import { useAtomValue } from "jotai";

export function useSummaryInfo(){
  const lastHash = useAtomValue(lastHashAtom);
  const summaryInfo = useLiveQuery(() => {
      return StocksDB.summaryInfo
      .toArray()
      .then((summaryInfoDB)=>{
        if(summaryInfoDB.length < 4) return null;
        return Object.fromEntries(
          Object.entries(summaryInfoDB).map(([key, info])=>{
            return [info.id, info.value]
          })
        );
      });
  }, [lastHash]) || {
    total: 0,
    current: 0,
    profit: 0,
    dividend: 0,
  } as SummaryInfo;

  return summaryInfo;
}

type SummaryInfo = Record<SUMMARY_INFO_KEYS, number>;