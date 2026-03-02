import { Grid } from '@mui/material'
import PastSalesBoard from './stock-dashboard/past-sales/PastSalesBoard';
import CurrentStocksBoard from './stock-dashboard/current-stocks/CurrentStocksBoard';

export default function StockDashboard() {
  return (
    <Grid container spacing={4} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Grid size={{ xs: 12, md: 7 }}>
        <CurrentStocksBoard />
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <PastSalesBoard />
      </Grid>
    </Grid>
  )
}
