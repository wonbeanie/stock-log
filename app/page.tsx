import SummaryInfo from './components/SummaryInfo';
import MainContents from './components/MainContents';
import ExchangeRateModal from './components/ExchangeRateModal';
import TradeDetailModal from './components/TradeDetailModal';

export default function Home() {
  return (
    <main className="p-8 bg-[#f8f9fa] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <SummaryInfo />

        <MainContents />
      </div>

      <ExchangeRateModal />
      <TradeDetailModal />
    </main>
  );
}