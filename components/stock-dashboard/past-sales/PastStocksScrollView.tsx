'use client'

import React, { useRef } from 'react'
import { useVirtualizer } from "@tanstack/react-virtual";
import { PastSale } from '@/store/stocks';
import { SelectedHistory } from './PastSalesBoard';
import HistoryCard from './HistoryCard';

export default function PastStocksScrollView({data, onHandlerCard} : Props) {
  const parentRef = useRef<HTMLTableSectionElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 95,
    overscan: 10,
  });
  
  return (
    <div ref={parentRef} className="p-4 space-y-3 flex-grow overflow-y-auto bg-gray-50/30">
      <div style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
        width: '100%',
        position: 'relative',
      }}>
        {
          rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const history = data[virtualRow.index];
            return (
              <div 
                key={virtualRow.key} // 가상화에서는 index보다 virtualRow.key 권장
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`, // 위치 고정의 핵심!
                }}
                onClick={() => onHandlerCard({name : history.name, ticker : history.ticker})}
              >
                <div className="flex justify-between items-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <HistoryCard history={history} />
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  )
}


interface Props {
  data : PastSale[],
  onHandlerCard : (history : SelectedHistory) => void;
}