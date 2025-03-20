import { useGetRecentTrades } from '@/api/hooks'
import { TradeItem } from './components/TradeItem'

type Props = {
  symbol: string
}

export const RecentTrades = ({ symbol }: Props) => {
  const { data, isLoading, isError, error } = useGetRecentTrades(symbol, 50)

  console.log('useGetRecentTrades.data: ', data)

  if (isError) {
    return (
      <div className="text-center p-4 text-red-500">
        Error loading trades: {error?.message || 'Unknown error'}
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <h3 className="mb-2 text-center text-lg">Recent Trades</h3>
      <div className="flex flex-col">
        <div className="rounded-md bg-secondary p-2">
          <div className="flex justify-between px-2 py-1 font-medium text-secondary-foreground">
            <span className="w-1/4">Type</span>
            <span className="w-1/4 text-right">Price</span>
            <span className="w-1/4 text-right">Amount</span>
            <span className="w-1/4 text-right">Time</span>
          </div>
        </div>
        <div className="mt-1 flex flex-1 flex-col overflow-y-auto gap-1 max-h-[608px]">
          {!isLoading && data
            ? data.map((trade) => (
                <TradeItem
                  key={trade.id}
                  price={trade.price}
                  time={trade.time}
                  isBuyerMaker={trade.isBuyerMaker}
                  quantity={trade.qty}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  )
}
