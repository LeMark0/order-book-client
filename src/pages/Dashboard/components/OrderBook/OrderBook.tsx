import { useWatchOrderBookData } from '@/hooks/useWatchOrderBookData'
import { useMemo } from 'react'
import { OrderList } from './components/OrderList'

interface OrderBookProps {
  symbol: string | undefined
  orderLimit?: number
}

export function OrderBook({ symbol, orderLimit = 17 }: OrderBookProps) {
  const { data, isIdle, isLoading } = useWatchOrderBookData(symbol)

  const bids = useMemo(() => {
    if (!data) {
      return []
    }

    return Object.entries(data.bids)
      .filter(([, qty]) => parseFloat(qty) > 0)
      .sort(([priceA], [priceB]) => parseFloat(priceB) - parseFloat(priceA))
      .slice(0, orderLimit)
  }, [data, orderLimit])

  const asks = useMemo(() => {
    if (!data) {
      return []
    }

    return Object.entries(data.asks)
      .filter(([, qty]) => parseFloat(qty) > 0)
      .sort(([priceA], [priceB]) => parseFloat(priceA) - parseFloat(priceB))
      .slice(0, orderLimit)
  }, [data, orderLimit])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row">
        <OrderList
          isLoading={!bids.length || isLoading}
          items={bids}
          variant="bid"
          title="Bid"
          orderLimit={orderLimit}
          isIdle={isIdle}
        />
        <OrderList
          isLoading={!asks.length || isLoading}
          items={asks}
          variant="ask"
          title="Ask"
          orderLimit={orderLimit}
          isIdle={isIdle}
        />
      </div>
    </div>
  )
}
