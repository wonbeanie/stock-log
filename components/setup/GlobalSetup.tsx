'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import { useServerCheck } from '@/hooks/useServerStatus';
import { useStocksPriceData } from '@/hooks/useStockPrice';
import { isOfflineAtom, updateLoadingAtom } from '@/store/baseAtoms';
import { useSetAtom } from 'jotai';
import { PriceInfo, updateStocksPriceAtom } from '@/store/price';
import { updateCurrentStocksPrice } from '@/lib/utils';

export default function GlobalSetup({ children }: { children: ReactNode }) {
  const {isSuccess, isError} = useServerCheck();
  const setIsOffLine = useSetAtom(isOfflineAtom);
  const {priceInfo, isComplete, isLoading} = useStocksPriceData();
  const updateStocksPrice = useSetAtom(updateStocksPriceAtom);
  const updateLoading = useSetAtom(updateLoadingAtom);

  useEffect(()=>{
    if(isSuccess){
      setIsOffLine(false);
      return;
    }

    if(isError){
      setIsOffLine(true);
      return;
    }
  },[isSuccess, isError, setIsOffLine]);

  useEffect(()=>{
    updateLoading({
      isLoading,
      isComplete
    });

    if(isComplete && priceInfo){
      requestUpdateStocksPrice(priceInfo);
      return;
    }
  },[isLoading, isComplete, priceInfo, updateStocksPrice, updateLoading])


  const requestUpdateStocksPrice = async (priceInfo : PriceInfo) => {
    await updateCurrentStocksPrice(priceInfo);
    updateStocksPrice(priceInfo);
  }


  return (
    <>
      {children}
    </>
  )
}
