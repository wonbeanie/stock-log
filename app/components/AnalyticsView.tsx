import { Card, Chip, Grid, Typography } from '@mui/material'
import React from 'react'

export default function AnalyticsView() {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card className="shadow-xl border-none rounded-3xl p-6 bg-white">
            <div className="flex justify-between items-center mb-6">
              <Typography className="font-black text-gray-800">자산 수익률 추이</Typography>
              <Chip label="최근 6개월" size="small" variant="outlined" className="text-gray-400 border-gray-200" />
            </div>
            <div className="h-[400px] w-full bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center">
              <Typography className="text-gray-300 font-medium italic">Line Chart Area</Typography>
            </div>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card className="shadow-xl border-none rounded-3xl p-6 bg-white">
            <Typography className="font-black text-gray-800 mb-6">포트폴리오 비중</Typography>
            <div className="h-[400px] w-full bg-gray-50 rounded-2xl border border-dashed border-gray-200 flex items-center justify-center">
              <Typography className="text-gray-300 font-medium italic">Pie Chart Area</Typography>
            </div>
          </Card>
        </Grid>
      </Grid>
    </div>
  )
}
