import { SymbolNames } from '@/constants/symbolNames.ts'

export type Ticker = keyof typeof SymbolNames

export function getSymbolName(ticker: Ticker): string {
  return SymbolNames[ticker]
}
