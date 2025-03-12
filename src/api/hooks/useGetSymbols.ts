import { useQuery } from '@tanstack/react-query'
import { fetchSymbolsDetails, fetchSymbolsStatistics } from '../rest'
import { SymbolInfo, SymbolStatistics } from '../types'
import { useMemo } from 'react'
import { getSymbolName } from '@/helpers/getSymbolName.ts'

type Options = {
  quoteAsset: string
  includeInactive?: boolean
}

export const useGetSymbols = ({ quoteAsset, includeInactive }: Options) => {
  const {
    data: symbolsDetails,
    isLoading: isLoadingDetails,
    isError: isErrorDetails,
  } = useQuery<SymbolInfo[], Error>({
    queryKey: ['symbolsDetails'],
    select: (data) => data.filter((symbol) => symbol.symbol.endsWith(quoteAsset)),
    queryFn: fetchSymbolsDetails,
  })

  const {
    data: symbolsStatistics,
    isLoading: isLoadingStatistics,
    isError: isErrorStatistics,
  } = useQuery<SymbolStatistics[], Error>({
    queryKey: ['symbolsStatistics'],
    select: (data) => data.filter((stat) => stat.symbol.endsWith(quoteAsset)),
    queryFn: fetchSymbolsStatistics,
    refetchInterval: 60_000,
  })

  const data = useMemo(() => {
    if (!symbolsDetails || !symbolsStatistics) return []

    const list = symbolsDetails.map(
      ({ quoteAsset, baseAsset, symbol, baseAssetPrecision, quotePrecision }) => ({
        quoteAsset,
        baseAsset,
        symbol,
        baseAssetPrecision,
        quotePrecision,
        stats: symbolsStatistics.find((stat) => stat.symbol === symbol),
        symbolName: getSymbolName(baseAsset),
      }),
    )

    if (includeInactive) {
      return list
    }

    return list.filter((symbol) => symbol.stats?.count !== 0)
  }, [includeInactive, symbolsDetails, symbolsStatistics])

  return {
    data,
    isLoading: isLoadingDetails || isLoadingStatistics,
    isError: isErrorDetails || isErrorStatistics,
  }
}
