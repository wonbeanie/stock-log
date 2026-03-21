'use client'

import React, { useRef } from 'react'
import CurrentStock from './CurrentStock'
import { SortedCurrentStocks } from '@/hooks/useCurrentStocks'
import { SelectedStock } from './CurrentStocksBoard'
import { useVirtualizer } from "@tanstack/react-virtual";

export default function StocksScrollView({data, onHandlerStock} : Props) {
  const parentRef = useRef<HTMLTableSectionElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 70,
    overscan: 10,
  });
  
  return (
    <tbody ref={parentRef} style={{
      height: `${rowVirtualizer.getTotalSize()}px`,
      position: 'relative',
    }}>
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const [stockName, stock] = data[virtualRow.index];
          return (
            <tr key={stockName}
                className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                onClick={() => onHandlerStock({name : stockName, ticker : stock.ticker})}>
              <CurrentStock key={stockName} stockName={stockName} stock={stock}/>
            </tr>
          );
        })}
    </tbody>
  )
}


interface Props {
  data : SortedCurrentStocks,
  onHandlerStock : (stock : SelectedStock) => void;
}