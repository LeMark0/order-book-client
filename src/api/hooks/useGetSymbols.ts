import { useQuery } from '@tanstack/react-query'
import { fetchSymbolsDetails, fetchSymbolsStatistics } from '../rest'
import { SymbolInfo, SymbolStatistics } from '../types'
import { useMemo } from 'react'

type Options = {
  quoteAsset: string
}

export const useGetSymbols = ({ quoteAsset }: Options) => {
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
  })

  const data = useMemo(() => {
    if (!symbolsDetails || !symbolsStatistics) return []

    return symbolsDetails.map(
      ({ quoteAsset, baseAsset, symbol, baseAssetPrecision, quotePrecision }) => ({
        quoteAsset,
        baseAsset,
        symbol,
        baseAssetPrecision,
        quotePrecision,
        stats: symbolsStatistics.find((stat) => stat.symbol === symbol),
      }),
    )
  }, [symbolsDetails, symbolsStatistics])

  return {
    data,
    isLoading: isLoadingDetails || isLoadingStatistics,
    isError: isErrorDetails || isErrorStatistics,
  }
}
