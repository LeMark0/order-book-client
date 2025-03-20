import { useCallback, useEffect, useRef, useState } from 'react'
import { DepthUpdateMessage, EventTypes, SubscriptionTypes } from '@/api/types'
import { useWebSocketContext } from '@/context/WebSocketContext'
import { useGetDepthSnapshot } from '@/api/hooks'

const IDLE_TIME = 3000

type OrderBookState = {
  bids: { [price: string]: string }
  asks: { [price: string]: string }
  lastUpdateId: number | null
  lastEventTime: number | null
}

const emptyState = {
  bids: {},
  asks: {},
  lastUpdateId: null,
  lastEventTime: null,
}

export function useWatchOrderBookData(symbol: string | undefined) {
  const { subscribe, onMessage } = useWebSocketContext()

  console.log('useWatchOrderBookData.symbol: ', symbol)

  const [orderBook, setOrderBook] = useState<OrderBookState>({ ...emptyState })
  const [isIdle, setIsIdle] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const bufferRef = useRef<DepthUpdateMessage[]>([])

  const { data: snapshot, isLoading: isSnapshotLoading } = useGetDepthSnapshot(
    symbol ?? '',
  )

  const subscribeForSymbol = useCallback(() => {
    if (!symbol) return

    subscribe({
      symbol: symbol.toLowerCase(),
      subscriptionType: SubscriptionTypes.Depth,
      frequency: 1000,
    })
  }, [symbol, subscribe])

  const applyUpdate = useCallback((event: DepthUpdateMessage) => {
    setOrderBook((prev) => {
      if (prev.lastUpdateId && event.u <= prev.lastUpdateId) return prev

      if (prev.lastUpdateId && event.U > prev.lastUpdateId + 1) {
        console.error(`Missed updates: U=${event.U}, lastUpdateId=${prev.lastUpdateId}`)
        bufferRef.current = []

        return { ...emptyState }
      }

      const newBids = { ...prev.bids }
      const newAsks = { ...prev.asks }

      event.b.forEach(([price, qty]) => {
        if (parseFloat(qty) === 0) {
          delete newBids[price]

          return
        }

        newBids[price] = qty
      })

      event.a.forEach(([price, qty]) => {
        if (parseFloat(qty) === 0) {
          delete newAsks[price]

          return
        }

        newAsks[price] = qty
      })

      return {
        ...prev,
        bids: newBids,
        asks: newAsks,
        lastUpdateId: event.u,
        lastEventTime: event.E,
      }
    })
  }, [])

  const handleDepthMessage = useCallback(
    (message: DepthUpdateMessage) => {
      if (message.s.toLowerCase() === symbol?.toLowerCase()) {
        if (!isInitialized) {
          bufferRef.current.push(message)

          return
        }

        applyUpdate(message)
      }
    },
    [symbol, isInitialized, applyUpdate],
  )

  useEffect(
    function initializeOrderBook() {
      if (!symbol || !snapshot || isSnapshotLoading || isInitialized) return

      const firstEventU = bufferRef.current.length > 0 ? bufferRef.current[0].U : null
      if (firstEventU && snapshot.lastUpdateId < firstEventU) {
        console.warn(
          `Snapshot outdated: lastUpdateId=${snapshot.lastUpdateId}, first U=${firstEventU}`,
        )
        bufferRef.current = []
      }

      const bids = Object.fromEntries(snapshot.bids.map(([price, qty]) => [price, qty]))
      const asks = Object.fromEntries(snapshot.asks.map(([price, qty]) => [price, qty]))

      setOrderBook({
        bids,
        asks,
        lastUpdateId: snapshot.lastUpdateId,
        lastEventTime: null,
      })

      const validEvents = bufferRef.current.filter(
        (event) => event.u > snapshot.lastUpdateId,
      )
      validEvents.forEach(applyUpdate)
      bufferRef.current = []
      setIsInitialized(true)
    },
    [symbol, snapshot, isSnapshotLoading, applyUpdate, isInitialized],
  )

  useEffect(
    function manageSubscription() {
      if (!symbol || !isInitialized) return

      subscribeForSymbol()
      const unsubscribe = onMessage(EventTypes.DepthUpdate, handleDepthMessage)

      return () => {
        unsubscribe()
        setIsInitialized(false)
      }
    },
    [symbol, isInitialized, subscribeForSymbol, handleDepthMessage, onMessage],
  )

  useEffect(
    function resetOnSymbolChange() {
      return () => {
        setOrderBook({ bids: {}, asks: {}, lastUpdateId: null, lastEventTime: null })
        bufferRef.current = []
        setIsInitialized(false)
      }
    },
    [symbol],
  )

  useEffect(
    function checkIfIdle() {
      const checkIdle = () => {
        if (!orderBook.lastEventTime) {
          setIsIdle(true)
          return
        }
        const now = Date.now()
        setIsIdle(now - orderBook.lastEventTime > IDLE_TIME)
      }

      checkIdle()
      const interval = setInterval(checkIdle, 1000)

      return () => clearInterval(interval)
    },
    [orderBook.lastEventTime],
  )

  return { data: orderBook, isIdle, isLoading: isSnapshotLoading, isInitialized }
}
