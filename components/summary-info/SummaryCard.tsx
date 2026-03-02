import { Card, Typography } from '@mui/material'

export default function SummaryCard({ label, value, unit, color }: SummaryCardProps) {
  return (
    <Card className="shadow-sm border-none rounded-2xl p-5 bg-white">
      <Typography className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">
        {label}
      </Typography>
      <div className="flex items-baseline gap-1">
        <Typography variant="h5" className={`font-black ${color}`}>
          {value.toLocaleString()}
        </Typography>
        <Typography className="text-gray-400 font-medium text-sm">{unit}</Typography>
      </div>
    </Card>
  )
}

interface SummaryCardProps {
  label: string;
  value: number;
  unit: string;
  color: string;
}