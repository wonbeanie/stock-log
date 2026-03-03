import { Grid } from '@mui/material'
import StockProportionPieChart from './charts/StockProportionPieChart'
import RateOfReturnBarChart from './charts/RateOfReturnBarChart'

export default function AnalyticsView() {
  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <RateOfReturnBarChart />
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <StockProportionPieChart />
        </Grid>
      </Grid>
    </div>
  )
}
