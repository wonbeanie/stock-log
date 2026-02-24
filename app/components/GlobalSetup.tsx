'use client'

import React, { ReactNode } from 'react'
import { useServerCheck } from '../hooks/useStock';

export default function GlobalSetup({ children }: { children: ReactNode }) {
  useServerCheck();

  return (
    <>
      {children}
    </>
  )
}
