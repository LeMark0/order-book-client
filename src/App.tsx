import './App.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DashboardPage } from '@/pages/Dashboard/DashboardPage.tsx'
import { useEffect } from 'react'
import { WebSocketProvider } from '@/context/WebSocketContext.ts'

const queryClient = new QueryClient()

function App() {
  useEffect(function setDarkModeByDefault() {
    document.body.classList.add('dark')
    return () => {
      document.body.classList.remove('dark')
    }
  }, [])

  return (
    <WebSocketProvider>
      <QueryClientProvider client={queryClient}>
        <DashboardPage />
      </QueryClientProvider>
    </WebSocketProvider>
  )
}

export default App
