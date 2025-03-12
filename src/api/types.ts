import { SymbolName } from '@/helpers/getSymbolName.ts'

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
  volume: string // Total trade volume (in base asset)
  quoteVolume: string // Total trade volume (in quote asset)
  openTime: number
  closeTime: number
  firstId: number
  lastId: number
  count: number
}

export type TradeDetails = {
  id: number
  price: string
  qty: string
  quoteQty: string
  time: number
  isBuyerMaker: boolean
  isBestMatch: boolean
}

export enum SubscriptionTypes {
  Depth = 'depth',
}

export enum WsMessageMethods {
  Subscribe = 'SUBSCRIBE',
  Unsubscribe = 'UNSUBSCRIBE',
  ListSubscriptions = 'LIST_SUBSCRIPTIONS',
}

export enum EventTypes {
  DepthUpdate = 'depthUpdate',
}

type BaseStreamMessage = {
  e: string // Event type
  E: number // Event time
  s: string // Symbol
}

type AdditionalProps = {
  [key: string]: unknown
}

export type StreamMessage<T> = BaseStreamMessage & AdditionalProps & T

export type OrderEntry = [string, string] // [price, quantity]

export type DepthUpdateMessage = StreamMessage<{
  e: 'depthUpdate' // Event type
  E: number // Event time in milliseconds
  s: string // Symbol
  U: number // First update ID in the event
  u: number // Last update ID in the event
  b: OrderEntry[] // Array of bid updates
  a: OrderEntry[] // Array of ask updates
}>
