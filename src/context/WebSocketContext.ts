import { buildContext } from '@/helpers/buildContext'

import { createWSConnection } from '@/api/ws'
import { useCallback, useEffect, useRef, useState } from 'react'
import { SubscriptionType, WsMessageMethod } from '@/api/types.ts'
import { v4 as uuid } from 'uuid'
import { useSendWsMessageWithCallback } from '@/hooks/useSendWsMessageWithCallback.ts'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { updateSubscription } from '@/helpers/updateSubscription'

type SubscriptionMessageOptions = {
  symbol: string
  subscriptionType: SubscriptionType
}

function createSubscriptionMessagePayload(
  method: WsMessageMethod,
  { symbol, subscriptionType }: SubscriptionMessageOptions,
) {
  const streamParams = `${symbol}@${subscriptionType}`

  return JSON.stringify({
    method,
    params: [streamParams],
    id: uuid(),
  })
}

function useWebSocket() {
  const [subscriptions, setSubscriptions] = useState<string[]>([])

  // const [data, setData] = useState({ orders: [], trades: [], coins: [] })

  const wsRef = useRef<ReconnectingWebSocket | null>(null)
  const { sendWsMessageWithCallback } = useSendWsMessageWithCallback()

  const unsubscribe = useCallback((options: SubscriptionMessageOptions) => {
    wsRef.current?.send(
      createSubscriptionMessagePayload(WsMessageMethod.Unsubscribe, options),
    )
  }, [])

  const subscribe = useCallback(
    (options: SubscriptionMessageOptions) => {
      const ws = wsRef.current

      console.log('try to subscribe: ', options)

      if (
        !ws ||
        ws.readyState === WebSocket.CLOSED ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        return
      }

      const newSubscription = `${options.symbol}@${options.subscriptionType}`

      setSubscriptions((prev) => updateSubscription(prev, options))

      sendWsMessageWithCallback(
        ws,
        {
          method: WsMessageMethod.ListSubscriptions,
        },
        (response) => {
          const subscriptions = response.result || []

          const activeSubscription = subscriptions.find((item) =>
            item.endsWith(`@${options.subscriptionType}`),
          )

          if (activeSubscription === newSubscription) {
            console.log('already subscribed: ', activeSubscription)
            return
          }

          if (activeSubscription) {
            sendWsMessageWithCallback(
              ws,
              {
                method: WsMessageMethod.Unsubscribe,
                params: [activeSubscription],
              },
              () => {
                console.log('unsubscribed: ', activeSubscription)
                ws?.send(
                  createSubscriptionMessagePayload(WsMessageMethod.Subscribe, options),
                )
              },
            )
            return
          }

          // subscribe now
          ws?.send(createSubscriptionMessagePayload(WsMessageMethod.Subscribe, options))
        },
      )
    },
    [sendWsMessageWithCallback],
  )

  const addEventListener = useCallback(
    (event: 'message' | 'open' | 'close', listener: EventListener) => {
      const ws = wsRef.current
      if (!ws) return

      ws.removeEventListener(event, listener)
      ws.addEventListener(event, listener)

      return () => ws.removeEventListener(event, listener)
    },
    [],
  )

  useEffect(function initializeConnection() {
    if (!wsRef.current) {
      console.log('initializeConnection(): ')
      wsRef.current = createWSConnection()

      wsRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data)
        console.log(message)
      }

      return function cleanup() {
        if (!wsRef.current) {
          return
        }

        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [])

  useEffect(
    function restoreSubscriptions() {
      const removeListener = addEventListener('open', () => {
        if (subscriptions.length) {
          console.log('re-subscribe: ', subscriptions)

          wsRef.current?.send(
            JSON.stringify({
              method: WsMessageMethod.Subscribe,
              params: subscriptions,
              id: uuid(),
            }),
          )
        }
      })

      return function cleanup() {
        if (removeListener) {
          removeListener()
        }
      }
    },
    [addEventListener, subscriptions],
  )

  console.log('subscriptions: ', subscriptions)

  return {
    // data,
    addEventListener,
    subscribe,
    unsubscribe,
  }
}

export const { ContextProvider: WebSocketProvider, useContext: useWebSocketContext } =
  buildContext(useWebSocket)
