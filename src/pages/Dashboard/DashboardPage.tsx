import { useGetSymbols } from '@/api/hooks'
import { SymbolList } from './components/SymbolList'

// TODO:
// Selected symbol card
// on click => SelectSymbolPopup
// SelectSymbolPopup contains a virtualized list of coins
// onclick updates selected symbol card and calls onChange prop

// Symbol list should contain: icon, name, pair, last price, 24h change, 24h volume

export const DashboardPage = () => {
  const { data, isLoading } = useGetSymbols({ quoteAsset: 'USDT' })

  console.log('isLoading: ', isLoading)

  console.log('data: ', data)

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <SymbolList />
    </div>
  )
}
