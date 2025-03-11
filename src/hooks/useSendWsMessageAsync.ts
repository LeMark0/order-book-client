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

export const useSendWsMessageAsync = () => {
  const sendWsMessageAsync = useCallback(
    (ws: ReconnectingWebSocket | null, message: WSMessage): Promise<WSResponse> => {
      return new Promise((resolve, reject) => {
        if (!ws || ws.readyState !== WebSocket.OPEN) {
          reject(new Error('WebSocket is not connected.'))
          return
        }

        const id = uuid()

        const listener = (event: MessageEvent) => {
          const response: WSResponse = JSON.parse(event.data)
          if (response.id === id) {
            resolve(response)
            ws.removeEventListener('message', listener)
          }
        }

        ws.addEventListener('message', listener)
        ws.send(JSON.stringify({ ...message, id }))
      })
    },
    [],
  )

  return {
    sendWsMessageAsync,
  }
}
