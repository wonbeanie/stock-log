import { Card, Chip, Grid, IconButton, Typography } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { eventBus } from '../modules/modules';
import { Events } from '../modules/events';

export default function StockDashboard() {

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
                {new Array(15).fill(0).map((_, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors group" onClick={showDetail}>
                    <td className="px-6 py-4 font-bold text-gray-900 text-sm">Apple Inc. <span className="text-gray-300 font-normal ml-1">AAPL</span></td>
                    <td className="px-6 py-4 text-center">
                      <Chip label="124일" size="small" className="bg-blue-50 text-blue-600 font-bold text-[10px]" />
                    </td>
                    <td className="px-6 py-4 text-center text-gray-600 text-sm font-medium">20,000,000원</td>
                    <td className="px-6 py-4 text-right font-black text-gray-400 group-hover:text-blue-600">15%</td>
                  </tr>
                ))}
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
            {new Array(10).fill(0).map((_, i) => (
              <div key={i} className="flex justify-between items-center p-4 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-500 font-bold text-xs">SELL</div>
                  <div>
                    <Typography className="font-bold text-sm text-gray-800">삼성전자</Typography>
                    <Typography className="text-[10px] text-gray-400 font-bold uppercase">2026.02.15</Typography>
                  </div>
                </div>
                <div className="text-right">
                  <Typography className="text-xs text-gray-400 font-medium">수익금</Typography>
                  <Typography className="font-black text-red-500 text-sm">+450,200원</Typography>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </Grid>
    </Grid>
  )
}
