'use client'

import React, { useRef } from 'react'
import CurrentStock from './CurrentStock'
import { SelectedStock } from './CurrentStocksBoard'
import { useVirtualizer } from "@tanstack/react-virtual";
import { CurrentStockTable } from '@/lib/db'

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
          const stock = data[virtualRow.index];
          return (
            <tr key={stock.name}
                className="hover:bg-gray-50/50 transition-colors group cursor-pointer"
                onClick={() => onHandlerStock({name : stock.name, ticker : stock.ticker})}>
              <CurrentStock key={stock.name} stockName={stock.name} stock={stock}/>
            </tr>
          );
        })}
    </tbody>
  )
}


interface Props {
  data : CurrentStockTable[],
  onHandlerStock : (stock : SelectedStock) => void;
}