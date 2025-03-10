import { useCallback } from 'react'
import { v4 as uuid } from 'uuid'
import { WsMessageMethod } from '@/api/types.ts'
import ReconnectingWebSocket from 'reconnecting-websocket'

type WSMessage = {
  id?: string
  method: WsMessageMethod
  params?: object
}

type WSResponse = {
  id: string
  result: string[] | null
}

export const useSendWsMessageWithCallback = () => {
  const sendWsMessageWithCallback = useCallback(
    (
      ws: ReconnectingWebSocket | null,
      message: WSMessage,
      callback: (response: WSResponse) => void,
    ) => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        console.error('WebSocket is not connected.')
        return
      }

      const id = uuid()

      const listener = (event: MessageEvent) => {
        const response: WSResponse = JSON.parse(event.data)
        if (response.id === id) {
          callback(response)
          ws.removeEventListener('message', listener)
        }
      }

      ws.addEventListener('message', listener)

      ws.send(JSON.stringify({ ...message, id }))

      return function cleanup() {
        ws.removeEventListener('message', listener)
      }
    },
    [],
  )

  return {
    sendWsMessageWithCallback,
  }
}
