import type { CurrentStock, PastSale } from '@/store/stocks';
import Dexie, { type EntityTable } from 'dexie';

export interface CurrentStockTable extends CurrentStock{
  id?: number;
}

export interface PastSaleTable extends PastSale {
  id?: number;
}

export interface SummaryData {
  id: string;
  value: number;
}

class StocksDatabase extends Dexie {
  summaryInfo! : EntityTable<SummaryData, 'id'>;
  currentStocks! : EntityTable<CurrentStockTable, 'id'>;
  pastSales! : EntityTable<PastSaleTable, 'id'>;

  constructor() {
    super('StocksDB');
    
    this.version(1).stores({
      summaryInfo : 'id',
      currentStocks: '++id, name, dateOfPossession, amountInput, returnRate',
      pastSales: '++id'
    });
  }
}

export const StocksDB = new StocksDatabase();

export const enum SUMMARY_INFO_KEYS {
  TOTAL = "total",
  CURRENT = "current",
  PROFIT = "profit",
  DIVIDEND = "dividend"
}