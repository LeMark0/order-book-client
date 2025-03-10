import { useGetSymbols } from '@/api/hooks'
import { Card } from '@/components/ui/card'
import { useCallback } from 'react'
import { getSymbolName } from '@/helpers/getCoinName'
import { useWatchOrderBookData } from '@/hooks/useWatchOrderBookData'

type Props = {
  quoteAsset: string
}

export const SymbolList = ({ quoteAsset }: Props) => {
  const { data, isLoading, isError } = useGetSymbols({ quoteAsset })

  const {
    subscribeForSymbol,
    // data
  } = useWatchOrderBookData()

  const handleChangeSymbol = useCallback(
    (symbol: string) => {
      const symbolFormatted = symbol.toLowerCase()

      subscribeForSymbol(symbolFormatted)
      // console.log('subscribeForSymbol: ', symbolFormatted)
    },
    [subscribeForSymbol],
  )

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading data</div>

  return (
    <div className="h-full overflow-y-auto">
      {data.map((asset) => (
        <Card
          key={asset.symbol}
          className="m-2 p-2 flex justify-between gap-2 cursor-pointer"
          onClick={() => handleChangeSymbol(asset.symbol)}
        >
          <div className="flex gap-4">
            <div className="text-xl">{asset.baseAsset}</div>
            <div className="text-lg text-accent-foreground">
              {getSymbolName(asset.baseAsset)}
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-start gap-1">
              <div className="text-xs text-muted">{quoteAsset}</div>
              <div>{asset.stats?.lastPrice}</div>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="text-xs text-muted">24h change</div>
              <div
                className={
                  asset.stats?.priceChangePercent.startsWith('-')
                    ? 'text-red-500'
                    : 'text-green-500'
                }
              >
                {asset.stats?.priceChangePercent}%
              </div>
            </div>

            <div className="flex  flex-col items-center gap-1">
              <div className="text-xs text-muted">Volume</div>
              <div>{asset.stats?.volume}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
