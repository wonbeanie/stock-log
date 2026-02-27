'use client'

import React, { ReactNode } from 'react'
import { useServerCheck } from '@/hooks/useServerStatus';
import { useStocksPriceData } from '@/hooks/useStockPrice';

export default function GlobalSetup({ children }: { children: ReactNode }) {
  useServerCheck();
  useStocksPriceData();

  return (
    <>
      {children}
    </>
  )
}
