import { useMemo } from 'react'

import { formatPrice, formatQuantity } from '@/helpers/numberFormaters'
import { cn } from '@/lib/utils'

type Props = {
  price: string
  quantity: string
  variant: 'ask' | 'bid'
  relativeVolume: number
}

export const OrderItem = ({ price, quantity, variant, relativeVolume }: Props) => {
  const textColor = variant === 'bid' ? 'text-green-500' : 'text-red-500'
  const barColor = variant === 'bid' ? 'bg-green-500/10' : 'bg-red-500/10'
  const barDirection = variant === 'bid' ? 'right-0' : 'left-0'

  const width = useMemo(
    () => `${Math.min(Math.max(relativeVolume, 0), 1) * 100}%`,
    [relativeVolume],
  )

  return (
    <div className="relative flex justify-between px-2 py-1 rounded-md text-foreground bg-secondary/10 overflow-hidden h-8 hover:bg-muted">
      <div
        className={cn(`absolute top-0 bottom-0 ${barDirection} h-full ${barColor}`, {
          'rounded-r-md': variant === 'bid',
          'rounded-l-md': variant === 'ask',
        })}
        style={{ width }}
        data-testid="order-item-bar"
      />
      <span className={`relative z-10 ${textColor}`}>{formatPrice(price)}</span>
      <span className="relative z-10">{formatQuantity(quantity)}</span>
    </div>
  )
}
