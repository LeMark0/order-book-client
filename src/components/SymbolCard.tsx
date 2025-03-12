import { Ticker } from '@/helpers/getSymbolName.ts'
import { formatPrice, formatVolume, percentFormatter } from '@/helpers/numberFormaters.ts'
import { cn } from '@/lib/utils.ts'
import { Card } from '@/components/ui/card.tsx'

type Props = {
  onClick?: () => void
  symbol: string
  symbolName: string
  baseAsset: Ticker
  quoteAsset: Ticker
  price: string
  priceChangePercent: number
  volume: string
}

export const SymbolCard = ({
  symbol,
  symbolName,
  priceChangePercent,
  quoteAsset,
  baseAsset,
  price,
  volume,
  onClick,
}: Props) => {
  return (
    <Card
      key={symbol}
      className={cn('p-4 flex justify-between gap-2 cursor-pointer', {
        'hover:bg-accent/10': onClick !== undefined,
      })}
      tabIndex={0}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        <div className="text-xl">{baseAsset}</div>
        <div className="text-md text-secondary">{symbolName}</div>
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col items-start gap-1">
          <div className="text-xs text-secondary">{quoteAsset}</div>
          <div className="font-medium">{formatPrice(price)}</div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="text-xs text-secondary">24h Change</div>
          <div
            className={cn({
              'text-red-500': priceChangePercent < 0,
              'text-green-500': priceChangePercent > 0,
            })}
          >
            {priceChangePercent > 0 && '+'}
            {percentFormatter.format(priceChangePercent)}
          </div>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="text-xs text-secondary">Volume</div>
          <div>{formatVolume(volume)}</div>
        </div>
      </div>
    </Card>
  )
}
