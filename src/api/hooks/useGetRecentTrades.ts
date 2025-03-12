import { useQuery } from '@tanstack/react-query'
import { TradeDetails } from '../types'
import { fetchRecentTrades } from '../rest'

export function useGetRecentTrades(symbol: string, limit: number) {
  return useQuery<TradeDetails[], Error>({
    queryKey: ['recentTrades', symbol],
    queryFn: () => fetchRecentTrades(symbol, limit),
    enabled: Boolean(symbol),
    staleTime: 2_000,
    refetchInterval: 1_000, // Auto-refetch every second
  })
}
