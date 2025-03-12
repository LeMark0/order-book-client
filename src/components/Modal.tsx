import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const [isMounted, setIsMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(
    function transitionVisibility() {
      let timeout: NodeJS.Timeout

      if (isOpen) {
        setIsMounted(true)
        timeout = setTimeout(() => setIsAnimating(true), 0)
      } else {
        setIsAnimating(false)
        timeout = setTimeout(() => setIsMounted(false), 300)
      }

      return () => clearTimeout(timeout)
    },
    [isOpen],
  )

  useEffect(
    function closeOnEscape() {
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && isOpen) {
          onClose()
        }
      }
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    },
    [isOpen, onClose],
  )

  useEffect(
    function disablePageScrolling() {
      document.body.style.overflow = isOpen ? 'hidden' : ''

      return () => {
        document.body.style.overflow = ''
      }
    },
    [isOpen],
  )

  if (!isMounted) return null

  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-sidebar/50 backdrop-blur-md',
        'transition-opacity duration-300 ease-out',
        isAnimating ? 'opacity-100' : 'opacity-0',
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          'bg-card rounded-lg shadow-lg max-w-md w-full mx-4 p-6 relative',
          'max-h-[90vh] overflow-y-auto',
          'transition-opacity duration-300 ease-out',
          isAnimating ? 'opacity-100' : 'opacity-0',
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-foreground focus:outline-none"
          onClick={onClose}
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  )
}
