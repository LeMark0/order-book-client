import axios from 'axios'
import { ExchangeInfo, SymbolInfo, SymbolStatistics, TradeDetails } from './types' // Assuming types are defined in 'types.ts'

const BASE_URL = 'https://api.binance.com/api/v3'

export const fetchSymbolsDetails = async (): Promise<SymbolInfo[]> => {
  const response = await axios.get<ExchangeInfo>(`${BASE_URL}/exchangeInfo`)
  return response.data.symbols
}

export const fetchSymbolsStatistics = async (): Promise<SymbolStatistics[]> => {
  const response = await axios.get(`${BASE_URL}/ticker/24hr`)
  return response.data
}

export const fetchRecentTrades = async (
  symbol: string,
  limit: number,
): Promise<TradeDetails[]> => {
  const response = await axios.get(`${BASE_URL}/trades`, { params: { symbol, limit } })
  return response.data
}
