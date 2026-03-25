import { PastSale } from '@/lib/type/stocks'
import { Typography } from '@mui/material'

export default function History({history : {type, amount, date, profits, settledAmount, unitPrice}} : Props) {
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

      <div className="flex justify-between items-end">
        <div>
          <Typography className="text-xs text-gray-500">
            단가: <span className="font-semibold text-gray-700">₩{unitPrice.toLocaleString()}</span>
          </Typography>
          
          <Typography className="text-[10px] text-gray-400">
            정산금액: ₩{settledAmount.toLocaleString()}
          </Typography>
        </div>

        {/* 매도 시에만 노출되는 수익금 영역 */}
        {type === '매도' && profits !== undefined && (
          <div className="text-right">
            <Typography className="text-[10px] text-gray-400 mb-[-2px]">수익금</Typography>
            <Typography className={`text-sm font-bold ${profits >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
              {profits >= 0 ? '+' : ''}{profits.toLocaleString()}원
            </Typography>
          </div>
        )}
      </div>
    </div>
    </>
  )
}

interface Props {
  history : PastSale
}