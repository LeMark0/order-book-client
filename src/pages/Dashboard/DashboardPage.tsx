import { SymbolList } from './components/SymbolList'

// TODO:
// Selected symbol card
// on click => SelectSymbolPopup
// SelectSymbolPopup contains a virtualized list of coins
// onclick updates selected symbol card and calls onChange prop

// Symbol list should contain: icon, name, pair, last price, 24h change, 24h volume

export const DashboardPage = () => {
  return <SymbolList quoteAsset="USDT" />
}
