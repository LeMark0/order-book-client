import { OrderBook } from './components/OrderBook'
import { useState } from 'react'
import { RecentTrades } from '@/pages/Dashboard/components/RecentTrades.tsx'
import { SymbolSelect } from './components/SymbolSelect'

const DEFAULT_SYMBOL = 'BTCUSDT'

export const DashboardPage = () => {
  const [symbol, setSymbol] = useState<string>(DEFAULT_SYMBOL) // TODO fix default subscription

  return (
    <div className="flex flex-col gap-4">
      <SymbolSelect quoteAsset="USDT" symbol={symbol} onChange={setSymbol} />
      <div className="flex w-full h-full gap-4 flex-1">
        <div className="w-1/2">
          <OrderBook symbol={symbol} />
        </div>
        <div className="w-1/2">
          <RecentTrades symbol={symbol} />
        </div>
      </div>
    </div>
  )
}
