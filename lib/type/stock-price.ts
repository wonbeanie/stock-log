export interface USTicker {
  [key: string] : string
}

export interface responsePrice {
    symbol : string,
    price : number
};

export interface RequestStocks {
  ticker: string;
  country: string;
}