import { useGetRecentTrades } from '@/api/hooks/useGetRecentTrades' // Adjust path
import { formatPrice } from '@/helpers/numberFormaters'

type Props = {
  symbol: string
}

export const RecentTrades = ({ symbol }: Props) => {
  const { data, isLoading, isError, error } = useGetRecentTrades(symbol, 50)

  if (isLoading) {
    return <div className="text-center p-4 text-gray-500">Loading recent trades...</div>
  }

  if (isError) {
    return (
      <div className="text-center p-4 text-red-500">
        Error loading trades: {error?.message || 'Unknown error'}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return <div className="text-center p-4 text-gray-500">No recent trades available</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-center mb-4">Recent Trades</h2>
      <div className="flex flex-col gap-2 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between p-2 bg-gray-100 rounded-md font-medium text-gray-700">
          <span className="w-1/4">Type</span>
          <span className="w-1/4 text-right">Price</span>
          <span className="w-1/4 text-right">Amount</span>
          <span className="w-1/4 text-right">Time</span>
        </div>
        {/* Trade Items */}
        {data.map((trade) => (
          <div
            key={trade.id}
            className="flex justify-between p-2 rounded-md hover:bg-gray-50"
          >
            <span
              className={`w-1/4 font-medium ${
                trade.isBuyerMaker ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {trade.isBuyerMaker ? 'Buy' : 'Sell'}
            </span>
            <span
              className={`w-1/4 text-right font-medium ${
                trade.isBuyerMaker ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {formatPrice(trade.price)}
            </span>
            <span className="w-1/4 text-right text-gray-700">
              {formatPrice(trade.qty)}
            </span>
            <span className="w-1/4 text-right text-gray-600">
              {new Date(trade.time).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
