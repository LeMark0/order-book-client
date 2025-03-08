import axios from 'axios'
import { ExchangeInfo, SymbolInfo, SymbolStatistics } from './types' // Assuming types are defined in 'types.ts'

const BASE_URL = 'https://api.binance.com/api/v3'

// Fetch symbols details
export const fetchSymbolsDetails = async (): Promise<SymbolInfo[]> => {
  const response = await axios.get<ExchangeInfo>(`${BASE_URL}/exchangeInfo`)
  return response.data.symbols
}

// Fetch 24hr trading statistics
export const fetchSymbolsStatistics = async (): Promise<SymbolStatistics[]> => {
  const response = await axios.get(`${BASE_URL}/ticker/24hr`)
  return response.data
}
