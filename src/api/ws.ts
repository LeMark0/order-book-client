import ReconnectingWebSocket from 'reconnecting-websocket'
import { WS_BASE_URI } from './constants.ts'

export const createWSConnection = (urlParams?: string) => {
  const ws = new ReconnectingWebSocket(
    `${WS_BASE_URI}/ws${urlParams ? `/${urlParams}` : ''}`,
  )

  ws.onopen = () => {
    console.log('WebSocket connected: ', urlParams)
  }

  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }

  ws.onclose = () => {
    console.log('WebSocket disconnected')
  }

  return ws
}
