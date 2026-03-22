export class WorkerMessage {
  type : string;
  payload : unknown;
  err : unknown;

  constructor(type : WorkerStatus, payload ?: unknown, err : unknown = null){
    this.type = type;
    this.payload = payload;
    this.err = err;
  }
}

export const enum WorkerStatus {
  DONE = 'DONE',
  ERROR = 'ERROR',
  PROCESS_EXCEL = 'PROCESS_EXCEL',
  EXCHANGE_RATIO = 'EXCHANGE_RATIO',
  PROCESS_PRICE = 'PROCESS_PRICE'
}