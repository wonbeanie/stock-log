import { PING_QUERY } from "@/lib/graphql";
import { isOfflineAtom, serverUrlAtom } from "@/store/baseAtoms";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";

export function useServerCheck(){
  const setIsOffLine = useSetAtom(isOfflineAtom);
  const serverUrl = useAtomValue(serverUrlAtom);

  const query = useQuery({
    queryKey : ['serverStatus'],
    queryFn: () => request(serverUrl, PING_QUERY),
    retry: 1,
    staleTime: 1000 * 60 * 5
  });

  useEffect(() => {
    if(query.isSuccess){
      setIsOffLine(false);
    }
    if(query.isError){
      setIsOffLine(true);
    }
  }, [query.isSuccess, query.isError, setIsOffLine])

  return query;
}