'use client'

import React, { ReactNode } from 'react'
import { useServerCheck, useStocksPriceData } from '../hooks/useStock';

export default function GlobalSetup({ children }: { children: ReactNode }) {
  useServerCheck();
  useStocksPriceData();

  return (
    <>
      {children}
    </>
  )
}
