import { Card, Chip, Grid, IconButton, Typography } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { eventBus } from '../modules/modules';
import { Events } from '../modules/events';
import { useAtomValue } from 'jotai';
import { stockDashboardAtom } from '../store/atoms';

export default function StockDashboard() {
  const {currentStocks, pastSales} = useAtomValue(stockDashboardAtom);

  const showDetail = () => {
    eventBus.emit(Events.SHOW_DETAIL_MODAL);
  }

  return (
    <Grid container spacing={4} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Grid size={{ xs: 12, md: 7 }}>
        <Card className="shadow-lg border border-gray-100 rounded-3xl flex flex-col h-[600px] overflow-hidden bg-white">
          <div className="p-6 flex justify-between items-center border-b border-gray-50">
            <Typography variant="h6" className="font-bold text-gray-800">현재 보유 종목</Typography>
            <IconButton className="bg-gray-50"><CalendarMonthIcon/></IconButton>
          </div>
          <div className="flex-grow overflow-y-auto custom-scrollbar">
            <table className="w-full text-left">
              <thead className="sticky top-0 bg-white/80 backdrop-blur-md z-20">
                <tr className="text-gray-400 text-[11px] font-bold uppercase tracking-widest border-b border-gray-50">
                  <th className="px-6 py-4">종목명</th>
                  <th className="px-6 py-4 text-center">보유일</th>
                  <th className="px-6 py-4 text-center">투입 금액</th>
                  <th className="px-6 py-4 text-right">비중</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {
                  Object.entries(currentStocks).map(([stockName, stock], i) => {
                    return (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors group" onClick={showDetail}>
                      <td className="px-6 py-4 font-bold text-gray-900 text-sm">{stockName} <span className="text-gray-300 font-normal ml-1">{stock.ticker}</span></td>
                      <td className="px-6 py-4 text-center">
                        <Chip label={`${stock.dateOfPossession}일`} size="small" className="bg-blue-50 text-blue-600 font-bold text-[10px]" />
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600 text-sm font-medium">{stock.amountInput.toLocaleString()}원</td>
                      <td className="px-6 py-4 text-right font-black text-gray-400 group-hover:text-blue-600">{stock.ratio}%</td>
                    </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        </Card>
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <Card className="shadow-lg border border-gray-100 rounded-3xl flex flex-col h-[600px] overflow-hidden bg-white">
          <div className="p-6 border-b border-gray-50">
            <Typography variant="h6" className="font-bold text-gray-800">과거 매매</Typography>
          </div>
          <div className="p-4 space-y-3 flex-grow overflow-y-auto custom-scrollbar bg-gray-50/30">
            {
              pastSales.map((history, i) => {
                const minus = history.profits < 0;
                const isBuy = history.type === "매수";
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
                  <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex gap-3 items-center">
                      <div className={`w-11 h-11 rounded-2xl ${typeColor} flex flex-col items-center justify-center transition-colors`}>
                        <span className="text-xs font-black">{history.type}</span>
                      </div>

                      <div>
                        <Typography className="font-bold text-sm text-gray-800 flex items-center gap-1">
                          {history.name}
                        </Typography>
                        <Typography className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                          {history.date}
                        </Typography>
                      </div>
                    </div>

                    <div className="text-right">
                      <Typography className="text-[10px] text-gray-400 font-bold">{typeLabel}</Typography>
                      <div className="flex flex-col">
                        <Typography className={`font-black ${profitColor} text-sm`}>
                          {!isBuy && !minus && "+"}
                          {history.profits.toLocaleString()}원
                        </Typography>
                      </div>
                    </div>
                  </div>
                )
              })
            }
          </div>
        </Card>
      </Grid>
    </Grid>
  )
}
