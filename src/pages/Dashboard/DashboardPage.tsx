import { useState } from 'react'

import { OrderBook } from './components/OrderBook/OrderBook'
import { RecentTrades } from './components/RecentTrades/RecentTrades'
import { SymbolSelect } from './components/SymbolSelect'
import { DEFAULT_SYMBOL, ORDER_BOOK_LIMIT } from './constants'

export const DashboardPage = () => {
  const [symbol, setSymbol] = useState<string>(DEFAULT_SYMBOL)

  return (
    <div className="flex flex-col gap-4">
      <SymbolSelect quoteAsset="USDT" symbol={symbol} onChange={setSymbol} />
      <div className="flex w-full h-full gap-16 flex-1">
        <div className="w-1/2">
          <OrderBook symbol={symbol} orderLimit={ORDER_BOOK_LIMIT} />
        </div>
        <div className="w-1/2">
          <RecentTrades symbol={symbol} />
        </div>
      </div>
    </div>
  )
}
