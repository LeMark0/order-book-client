import { useCallback } from 'react'
import { SubscriptionType } from '@/api/types.ts'
import { useWebSocketContext } from '@/context/WebSocketContext.ts'

export const useWatchOrderBookData = () => {
  // here I need to call WS subscription for depth from the main WS hook
  // move setSymbol method here
  // select depth data with memo and return

  const { subscribe } = useWebSocketContext()

  const subscribeForSymbol = useCallback(
    (symbol: string) => {
      const payload = {
        symbol,
        subscriptionType: SubscriptionType.Depth,
      }

      subscribe(payload)
    },
    [subscribe],
  )

  return {
    subscribeForSymbol,
    // data
  }
}
