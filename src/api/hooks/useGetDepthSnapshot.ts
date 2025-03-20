import { useQuery } from '@tanstack/react-query'
import { DepthSnapshot } from '../types'
import { fetchDepthSnapshot } from '../rest'

export function useGetDepthSnapshot(symbol: string, limit?: number) {
  return useQuery<DepthSnapshot, Error>({
    queryKey: ['orderBookSnapshot', symbol],
    queryFn: () => fetchDepthSnapshot(symbol, limit),
    enabled: Boolean(symbol),
  })
}
