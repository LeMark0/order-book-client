import { useGetSymbols } from '@/api/hooks'
import { Card } from '@/components/ui/card'
import { getSymbolName } from '@/helpers/getCoinName.ts'

export const SymbolList = () => {
  const { data, isLoading, isError } = useGetSymbols({ quoteAsset: 'USDT' })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading data</div>

  return (
    <div className="h-full overflow-y-auto">
      {data.map((coin) => (
        <Card key={coin.symbol} className="m-2 p-2 flex justify-between gap-8">
          <div className="flex gap-4">
            <div className="text-xl">{coin.baseAsset}</div>
            <div className="text-lg text-secondary-foreground">
              {getSymbolName(coin.baseAsset)}
            </div>
          </div>
          <div className="flex gap-4">
            <div>{coin.stats?.lastPrice} USDT</div>
            <div
              className={
                coin.stats?.priceChangePercent.startsWith('-')
                  ? 'text-red-500'
                  : 'text-green-500'
              }
            >
              {coin.stats?.priceChangePercent}%
            </div>
            <div>Vol: {coin.stats?.volume}</div>
          </div>
        </Card>
      ))}
    </div>
  )
}
