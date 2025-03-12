import { useGetSymbols } from '@/api/hooks'
import { SymbolCard } from '@/components/SymbolCard'
import { useMemo } from 'react'
import { useBoolean } from 'usehooks-ts'
import { SymbolListModal } from '@/pages/Dashboard/components/SymbolListModal.tsx'

type Props = {
  symbol?: string
  quoteAsset: string
  onChange: (symbol: string) => void
}

export const SymbolSelect = ({ symbol, quoteAsset, onChange }: Props) => {
  const { data, isLoading, isError } = useGetSymbols({ quoteAsset })

  const isModalOpen = useBoolean(false)

  const selectedAsset = useMemo(
    () => data.find((asset) => asset.symbol === symbol),
    [data, symbol],
  )

  if (isLoading) return <div className="text-center p-4">Loading...</div>
  if (isError)
    return <div className="text-center p-4 text-red-500">Error loading data</div>

  const lastPrice = selectedAsset?.stats?.lastPrice ?? '0'
  const priceChangePercent = selectedAsset?.stats?.priceChangePercent
    ? parseFloat(selectedAsset?.stats.priceChangePercent) / 100 // Adjust if already a decimal
    : 0
  const quoteVolume = selectedAsset?.stats?.quoteVolume ?? '0'

  return (
    <>
      {selectedAsset ? (
        <SymbolCard
          symbol={selectedAsset.symbol}
          symbolName={selectedAsset.symbolName}
          onClick={isModalOpen.setTrue}
          baseAsset={selectedAsset.baseAsset}
          quoteAsset={selectedAsset.quoteAsset}
          price={lastPrice}
          volume={quoteVolume}
          priceChangePercent={priceChangePercent}
        />
      ) : null}
      <SymbolListModal
        data={data}
        isOpen={isModalOpen.value}
        onClose={isModalOpen.setFalse}
        onChange={onChange}
      />
    </>
  )
}
