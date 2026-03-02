import { Typography } from '@mui/material';

export default function HistoryCard({profits, type, name, date} : Props) {
  const minus = profits < 0;
  const isBuy = type === "매수";
  const typeColor = isBuy ?
  'bg-gray-100 text-gray-600' :
  minus ?
  'bg-blue-50 text-blue-600' :
  'bg-red-50 text-red-600';

  const typeLabel = isBuy ? "매수금" : "수익금";
  const profitColor = isBuy ?
  'text-gray-900' :
  minus ? 'text-blue-500' : 'text-red-500';

  return (
    <>
      <div className="flex gap-3 items-center">
        <div className={`w-11 h-11 rounded-2xl ${typeColor} flex flex-col items-center justify-center transition-colors`}>
          <span className="text-xs font-black">{type}</span>
        </div>

        <div>
          <Typography className="font-bold text-sm text-gray-800 flex items-center gap-1">
            {name}
          </Typography>
          <Typography className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
            {date}
          </Typography>
        </div>
      </div>

      <div className="text-right">
        <Typography className="text-[10px] text-gray-400 font-bold">{typeLabel}</Typography>
        <div className="flex flex-col">
          <Typography className={`font-black ${profitColor} text-sm`}>
            {(!isBuy && !minus) && "+"}
            {profits.toLocaleString()}원
          </Typography>
        </div>
      </div>
    </>
  )
}

interface Props {
  profits : number;
  type : string;
  name : string;
  date : string;
}