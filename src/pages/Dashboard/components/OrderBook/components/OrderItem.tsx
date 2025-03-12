import { formatPrice, formatQuantity } from '@/helpers/numberFormaters.ts'
import { useMemo } from 'react'

type Props = {
  price: string
  quantity: string
  variant: 'ask' | 'bid'
  relativeVolume: number // Value between 0 and 1 representing volume proportion
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
    <div className="relative flex justify-between px-2 py-1 text-foreground bg-secondary/10 min-h-8 hover:bg-muted">
      <div
        className={`absolute top-0 bottom-0 ${barDirection} h-full ${barColor}`}
        style={{ width }}
      />
      <span className={`relative z-10 ${textColor}`}>{formatPrice(price)}</span>
      <span className="relative z-10">{formatQuantity(quantity)}</span>
    </div>
  )
}
