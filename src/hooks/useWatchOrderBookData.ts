import { useCallback, useEffect, useState } from 'react'
import { DepthUpdateMessage, EventTypes, SubscriptionTypes } from '@/api/types.ts'
import { useWebSocketContext } from '@/context/WebSocketContext.ts'

const IDLE_TIME = 3000

export function useWatchOrderBookData(symbol: string | undefined) {
  const { subscribe, onMessage } = useWebSocketContext()
  const [orderBook, setOrderBook] = useState<DepthUpdateMessage | null>(null)
  const [isIdle, setIsIdle] = useState(false)

  const subscribeForSymbol = useCallback(() => {
    if (!symbol) return

    subscribe({
      symbol: symbol.toLowerCase(),
      subscriptionType: SubscriptionTypes.Depth,
      frequency: 1000,
    })
  }, [symbol, subscribe])

  const handleDepthMessage = useCallback(
    (message: DepthUpdateMessage) => {
      if (symbol && message.s.toLowerCase() === symbol.toLowerCase()) {
        setOrderBook(message)
      }
    },
    [symbol],
  )

  useEffect(
    function manageSubscription() {
      setOrderBook(null)

      if (!symbol) return

      subscribeForSymbol()
      const unsubscribe = onMessage(EventTypes.DepthUpdate, handleDepthMessage)
      return () => unsubscribe()
    },
    [symbol, subscribeForSymbol, handleDepthMessage, onMessage],
  )

  useEffect(
    function checkIfIdle() {
      const checkIdle = () => {
        if (!orderBook || !orderBook.E) {
          setIsIdle(true)
          return
        }
        const now = Date.now()
        const lastUpdate = orderBook.E
        setIsIdle(now - lastUpdate > IDLE_TIME)
      }

      checkIdle()
      const interval = setInterval(checkIdle, 1000)

      return () => clearInterval(interval)
    },
    [orderBook],
  )

  return { data: orderBook, isIdle }
}
