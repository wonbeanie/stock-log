import { GET_TICKERS } from "@/lib/graphql";
import { formatTickers } from "@/lib/price-utils";
import { serverUrlAtom } from "@/store/baseAtoms"
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAtomValue } from "jotai";

export const useUSTickers = (isinList: string[], enabled: boolean) => {
  const serverUrl = useAtomValue(serverUrlAtom);

  return useQuery({
    queryKey : ["tickers", isinList],
    queryFn : () => request(serverUrl, GET_TICKERS, {isinList}),
    enabled: enabled && isinList.length > 0,
    select: (data) => formatTickers(data.getTickers),
    staleTime: Infinity
  });
}