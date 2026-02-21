'use client'

import { Button, ButtonGroup } from '@mui/material'
import StockDashboard from './StockDashboard'
import AnalyticsView from './AnalyticsView'
import DashboardIcon from '@mui/icons-material/Dashboard';
import PieChartIcon from '@mui/icons-material/PieChart';
import { useState } from 'react';

export default function MainContents() {
  const [viewMode, setViewMode] = useState<VIEW_MODE>(VIEW_MODE.MAIN);
  const buttonClassName = "px-8 py-2 rounded-xl border-none font-bold transition-all";
  

  const changeViewButton = (changeMode : VIEW_MODE) => {
    const selectedClassName = "bg-white text-blue-600 shadow-md";
    const unselectedClassName = "text-gray-500 hover:bg-gray-200";
    if (viewMode === changeMode) {
      return selectedClassName;
    } else {
      return unselectedClassName;
    }
  }

  return (
    <>
      <div className="flex justify-center">
        <ButtonGroup className="bg-gray-100 p-1 rounded-2xl shadow-inner border-none">
          <Button 
            onClick={() => setViewMode(VIEW_MODE.MAIN)}
            className={`${buttonClassName} ${changeViewButton(VIEW_MODE.MAIN)}`}
            startIcon={<DashboardIcon />}
          >
            종합 대시보드
          </Button>
          <Button 
            onClick={() => setViewMode(VIEW_MODE.SIMPLE)}
            className={`${buttonClassName} ${changeViewButton(VIEW_MODE.SIMPLE)}`}
            startIcon={<PieChartIcon />}
          >
            시각화 분석
          </Button>
        </ButtonGroup>
      </div>

      {viewMode === VIEW_MODE.MAIN && (
        <StockDashboard />
      )}

      {viewMode === VIEW_MODE.SIMPLE && (
        <AnalyticsView />
      )}
    </>
  )
}

enum VIEW_MODE {
  "MAIN" = "main",
  "SIMPLE" = "simple"
}