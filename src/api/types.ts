import { SymbolName } from '@/helpers/getCoinName.ts'

type RateLimit = {
  rateLimitType?: string
  interval?: string
  intervalNum?: number
  limit?: number
}

type Filter = {
  filterType?: string
  minPrice?: string
  maxPrice?: string
  tickSize?: string
}

export type SymbolInfo = {
  symbol: string
  status: string
  baseAsset: SymbolName
  baseAssetPrecision: number
  quoteAsset: SymbolName
  quotePrecision?: number // Marked for deprecation in future versions
  quoteAssetPrecision: number
  baseCommissionPrecision: number
  quoteCommissionPrecision: number
  orderTypes: string[]
  icebergAllowed: boolean
  ocoAllowed: boolean
  otoAllowed: boolean
  quoteOrderQtyMarketAllowed: boolean
  allowTrailingStop: boolean
  cancelReplaceAllowed: boolean
  isSpotTradingAllowed: boolean
  isMarginTradingAllowed: boolean
  filters: Filter[]
  permissions: string[]
  permissionSets: string[][]
  defaultSelfTradePreventionMode: string
  allowedSelfTradePreventionModes: string[]
}

type Sor = {
  baseAsset: string
  symbols: string[]
}

export type ExchangeInfo = {
  timezone: string
  serverTime: number
  rateLimits: RateLimit[]
  exchangeFilters: Filter[]
  symbols: SymbolInfo[]
  sors?: Sor[]
}

export type SymbolStatistics = {
  symbol: string
  priceChange: string
  priceChangePercent: string
  weightedAvgPrice: string
  prevClosePrice: string
  lastPrice: string
  lastQty: string
  bidPrice: string
  bidQty: string
  askPrice: string
  askQty: string
  openPrice: string
  highPrice: string
  lowPrice: string
  volume: string
  quoteVolume: string
  openTime: number
  closeTime: number
  firstId: number
  lastId: number
  count: number
}

export enum SubscriptionType {
  Depth = 'depth',
}

export enum WsMessageMethod {
  Subscribe = 'SUBSCRIBE',
  Unsubscribe = 'UNSUBSCRIBE',
  ListSubscriptions = 'LIST_SUBSCRIPTIONS',
}
