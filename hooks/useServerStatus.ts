import { PING_QUERY } from "@/lib/graphql";
import { serverUrlAtom } from "@/store/baseAtoms";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAtomValue } from "jotai";

export function useServerCheck(){
  const serverUrl = useAtomValue(serverUrlAtom);

  const query = useQuery({
    queryKey : ['serverStatus'],
    queryFn: () => request(serverUrl, PING_QUERY),
    retry: 1,
    staleTime: 1000 * 60 * 5
  });

  return query;
}