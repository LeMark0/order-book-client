import { SymbolNames } from '@/constants/cryptocurrencies.ts'

export type SymbolName = keyof typeof SymbolNames

export function getSymbolName(ticker: SymbolName): string {
  return SymbolNames[ticker]
}
