import { Typography } from '@mui/material'

export default function History({type, amount, date, price} : Props) {
  return (
    <>
      <div className={`w-[24px] h-[24px] rounded-full border-4 border-white shadow-sm flex-shrink-0 ${
        type === '매수' ? 'bg-red-500' : 'bg-blue-500'
      }`} />
      
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-1">
          <Typography className="text-sm font-bold text-gray-800">
            {type} {amount.toLocaleString()}주
          </Typography>
          <Typography className="text-[11px] text-gray-400 font-medium">
            {date}
          </Typography>
        </div>
        <Typography className="text-xs text-gray-500">
          체결가: <span className="font-semibold text-gray-700">₩{price.toLocaleString()}</span>
        </Typography>
      </div>
    </>
  )
}

interface Props {
  type: string;
  amount: number;
  date: string;
  price: number;
}