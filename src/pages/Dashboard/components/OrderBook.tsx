import { useWatchOrderBookData } from '@/hooks/useWatchOrderBookData'
import { useMemo } from 'react'

interface OrderBookProps {
  symbol: string | undefined
  orderLimit?: number // Optional prop with default value
}

export function OrderBook({ symbol, orderLimit = 17 }: OrderBookProps) {
  const orderBook = useWatchOrderBookData(symbol)

  const bids = useMemo(() => {
    if (!orderBook) {
      return []
    }

    return orderBook.b
      .filter(([, qty]) => parseFloat(qty) > 0)
      .sort(([priceA], [priceB]) => parseFloat(priceB) - parseFloat(priceA))
      .slice(0, orderLimit)
  }, [orderBook, orderLimit])

  const asks = useMemo(() => {
    if (!orderBook) {
      return []
    }

    return orderBook.a
      .filter(([, qty]) => parseFloat(qty) > 0)
      .sort(([priceA], [priceB]) => parseFloat(priceA) - parseFloat(priceB))
      .slice(0, orderLimit)
  }, [orderBook, orderLimit])

  if (!orderBook) {
    return (
      <div className="text-center text-gray-500 p-4">
        Loading order book for {symbol || 'unknown symbol'}...
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl text-center mb-4">Order Book for {symbol || 'Unknown'}</h2>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Bids Column */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-center text-green-600 mb-2">Bids</h3>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-secondary">
                <th className="p-2 text-right font-medium">Price</th>
                <th className="p-2 text-right font-medium">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {bids.map(([price, qty], index) => (
                <tr
                  key={`bid-${index}`}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-2 text-right">{parseFloat(price).toFixed(2)}</td>
                  <td className="p-2 text-right">{parseFloat(qty).toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Asks Column */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-center text-red-600 mb-2">Asks</h3>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-secondary">
                <th className="p-2 text-right font-medium">Price</th>
                <th className="p-2 text-right font-medium">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {asks.map(([price, qty], index) => (
                <tr
                  key={`ask-${index}`}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="p-2 text-right">{parseFloat(price).toFixed(2)}</td>
                  <td className="p-2 text-right">{parseFloat(qty).toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
