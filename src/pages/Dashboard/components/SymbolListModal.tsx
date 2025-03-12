import React, { useCallback, useState } from 'react'
import { Modal } from '@/components/Modal' // Adjust path
import { useGetSymbols } from '@/api/hooks' // Adjust path
import { SymbolCard } from '@/components/SymbolCard' // Adjust path
import { Input } from '@/components/ui/input' // Adjust path to shadcn Input
import debounce from 'lodash/debounce' // Import Lodash debounce
import { Virtuoso } from 'react-virtuoso' // Import react-virtuoso

type Props = {
  isOpen: boolean
  onClose: () => void
  data: ReturnType<typeof useGetSymbols>['data']
  onChange: (symbol: string) => void
}

export const SymbolListModal = ({ isOpen, onClose, data, onChange }: Props) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [inputValue, setInputValue] = useState('') // For controlled input

  const handleSelect = useCallback(
    (symbol: string) => {
      onChange(symbol)
      onClose()
    },
    [onChange, onClose],
  )

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value)
    }, 300),
    [],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    debouncedSearch(value)
  }

  const filteredData = data?.filter((asset) =>
    `${asset.symbol}${asset.baseAsset}${asset.symbolName ?? ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4 p-2 max-h-[calc(90vh-4rem)]">
        {/* Search Field - Pinned at top */}
        <Input
          type="search"
          placeholder="Search symbols..."
          value={inputValue}
          onChange={handleInputChange}
          className="w-full sticky top-0 z-10 bg-[var(--card)]"
        />
        <div className="flex-1">
          {filteredData?.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">No symbols found</div>
          ) : (
            <Virtuoso
              style={{ height: '60vh' }}
              data={filteredData}
              itemContent={(_, asset) => {
                const lastPrice = asset.stats?.lastPrice ?? '0'
                const priceChangePercent = asset.stats?.priceChangePercent
                  ? parseFloat(asset.stats.priceChangePercent) / 100
                  : 0
                const quoteVolume = asset.stats?.quoteVolume ?? '0'

                return (
                  <div className="py-1">
                    <SymbolCard
                      key={asset.symbol}
                      symbol={asset.symbol}
                      symbolName={asset.symbolName}
                      onClick={() => handleSelect(asset.symbol)}
                      baseAsset={asset.baseAsset}
                      quoteAsset={asset.quoteAsset}
                      price={lastPrice}
                      volume={quoteVolume}
                      priceChangePercent={priceChangePercent}
                    />
                  </div>
                )
              }}
              className="scrollbar-hidden"
            />
          )}
        </div>
      </div>
    </Modal>
  )
}
