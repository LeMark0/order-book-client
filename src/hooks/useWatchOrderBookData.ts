import { useCallback, useEffect, useState } from 'react'
import { DepthUpdateMessage, EventTypes, SubscriptionTypes } from '@/api/types.ts'
import { useWebSocketContext } from '@/context/WebSocketContext.ts'

export function useWatchOrderBookData(symbol: string | undefined) {
  const { subscribe, onMessage } = useWebSocketContext()
  const [orderBook, setOrderBook] = useState<DepthUpdateMessage | null>(null)

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
        console.log('handleDepthMessage: ', message)

        setOrderBook(message)
      }
    },
    [symbol],
  )

  useEffect(
    function manageSubscription() {
      if (!symbol) return

      subscribeForSymbol()
      const unsubscribe = onMessage(EventTypes.DepthUpdate, handleDepthMessage)
      return () => unsubscribe()
    },
    [symbol, subscribeForSymbol, handleDepthMessage, onMessage],
  )

  return orderBook
}
