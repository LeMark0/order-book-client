import { useCallback, useEffect, useRef, useState } from 'react'
import { SubscriptionTypes, WsMessageMethods } from '@/api/types.ts'
import { v4 as uuid } from 'uuid'
import ReconnectingWebSocket from 'reconnecting-websocket'
import { updateSubscription } from '@/helpers/updateSubscription'
import { useSendWsMessageAsync } from '@/hooks/useSendWsMessageAsync.ts'
import { createWSConnection } from '@/api/ws'
import { buildContext } from '@/lib/buildContext.tsx'

type MessageHandler = (message: string) => void

type SubscriptionOptions = {
  symbol: string
  subscriptionType: SubscriptionTypes
  frequency?: number
}

function createSubscriptionValue({
  symbol,
  subscriptionType,
  frequency,
}: SubscriptionOptions) {
  const frequencyFormatted = frequency ? `${frequency}ms` : undefined

  return [symbol, subscriptionType, frequencyFormatted].filter(Boolean).join('@')
}

function createSubscriptionMessagePayload(
  method: WsMessageMethods,
  options: SubscriptionOptions,
) {
  const streamParams = createSubscriptionValue(options)

  return JSON.stringify({
    method,
    params: [streamParams],
    id: uuid(),
  })
}

function useWebSocket() {
  const [subscriptions, setSubscriptions] = useState<string[]>([])
  const wsRef = useRef<ReconnectingWebSocket | null>(null)
  const { sendWsMessageAsync } = useSendWsMessageAsync()

  // Registry for message handlers by event type
  const handlersRef = useRef<Map<string, Set<MessageHandler>>>(new Map())

  const subscribe = useCallback(
    async (options: SubscriptionOptions) => {
      const ws = wsRef.current

      setSubscriptions((prev) => updateSubscription(prev, options))

      if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.warn('Could not subscribe: WebSocket is not connected')
        return
      }

      const newSubscription = createSubscriptionValue(options)

      console.log('newSubscription: ', newSubscription)

      const subscriptionsResponse = await sendWsMessageAsync(ws, {
        method: WsMessageMethods.ListSubscriptions,
      })

      const activeSubscription = subscriptionsResponse.result?.find((item) =>
        item.includes(`@${options.subscriptionType}`),
      )

      if (activeSubscription === newSubscription) {
        console.log('Already subscribed:', activeSubscription)
        return
      }

      if (activeSubscription) {
        await sendWsMessageAsync(ws, {
          method: WsMessageMethods.Unsubscribe,
          params: [activeSubscription],
        })
        console.log('Unsubscribed:', activeSubscription)
      }

      ws?.send(createSubscriptionMessagePayload(WsMessageMethods.Subscribe, options))
    },
    [sendWsMessageAsync],
  )

  // Register a handler for a specific event type
  const onMessage = useCallback((eventType: string, handler: MessageHandler) => {
    if (!handlersRef.current.has(eventType)) {
      handlersRef.current.set(eventType, new Set())
    }
    handlersRef.current.get(eventType)!.add(handler)

    return () => {
      handlersRef.current.get(eventType)?.delete(handler)
    }
  }, [])

  // Centralized message handling
  const handleMessage = useCallback((event: MessageEvent) => {
    const message = JSON.parse(event.data)
    const eventType = message.e // Assuming 'e' is the event type field (e.g., 'depthUpdate')

    if (eventType && handlersRef.current.has(eventType)) {
      const handlers = handlersRef.current.get(eventType)!
      handlers.forEach((handler) => handler(message))
    }
  }, [])

  useEffect(
    function initializeConnection() {
      if (!wsRef.current) {
        console.log('initializeConnection(): ')
        wsRef.current = createWSConnection()
        wsRef.current.addEventListener('message', handleMessage)

        return () => {
          wsRef.current?.close()
          wsRef.current?.removeEventListener('message', handleMessage)
          wsRef.current = null
        }
      }
    },
    [handleMessage],
  )

  useEffect(
    function restoreSubscriptions() {
      const ws = wsRef.current
      if (!ws) return

      const handleOpen = () => {
        if (subscriptions.length) {
          console.log('Re-subscribe:', subscriptions)
          ws.send(
            JSON.stringify({
              method: WsMessageMethods.Subscribe,
              params: subscriptions,
              id: uuid(),
            }),
          )
        }
      }

      ws.addEventListener('open', handleOpen)
      return () => ws.removeEventListener('open', handleOpen)
    },
    [subscriptions],
  )

  return {
    ws: wsRef.current,
    subscribe,
    onMessage,
  }
}

export const { ContextProvider: WebSocketProvider, useContext: useWebSocketContext } =
  buildContext(useWebSocket)
