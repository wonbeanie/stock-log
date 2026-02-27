import { gql } from "graphql-request";

export const GET_STOCKS = gql`
  query GetStocks($stocks : [Stock]!) {
    getStocks(stocks : $stocks) {
      symbol
      price
    }
  }
`;

export const GET_TICKERS = gql`
  query GetTickers($isinList : [String]!){
    getTickers(isinList : $isinList){
      ticker,
      isin
    }
  }
`

export const GET_TICKER = gql`
  query GetTicker($isin: String!) {
    getTicker(isin: $isin) {
      ticker
    }
  }
`;

export const GET_PRICE = gql`
  query GetStock($ticker: String!, $market: String!) {
    getStock(ticker: $ticker, market: $market) {
      price
    }
  }
`;

export const PING_QUERY = gql`
  query Ping {
    ping
  }
`;