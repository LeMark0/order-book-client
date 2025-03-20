import { useMemo } from 'react'

import { OrderEntry } from '@/api/types'
import { ORDER_BOOK_LIMIT } from '@/pages/Dashboard/constants'
import { EmptyRow } from './EmptyRow'
import { OrderItem } from './OrderItem'
import { cn } from '@/lib/utils'

type Props = {
  items: OrderEntry[]
  title: string
  variant: 'ask' | 'bid'
  orderLimit?: number
  isIdle?: boolean
  isLoading?: boolean
}

export const OrderList = ({
  items,
  variant,
  title,
  orderLimit = ORDER_BOOK_LIMIT,
  isIdle = false,
  isLoading,
}: Props) => {
  const isDataReady = !isIdle && !isLoading

  const emptyRows = useMemo(
    () => (isDataReady ? Math.max(0, orderLimit - items.length) : orderLimit),
    [isDataReady, items.length, orderLimit],
  )

  const maxQuantity = useMemo(() => {
    if (!items.length) return 0
    return Math.max(...items.map(([, qty]) => parseFloat(qty) || 0))
  }, [items])

  return (
    <div className={cn('flex-1', { grayscale: !isDataReady })}>
      <h3 className="mb-2 text-center text-lg">{title}</h3>
      <div className="rounded-md bg-secondary p-2">
        <div className="flex justify-between px-2 py-1 font-medium text-secondary-foreground">
          <span>Price</span>
          <span>Quantity</span>
        </div>
      </div>
      <div className="mt-1 flex flex-col gap-1">
        {isDataReady
          ? items.map(([price, qty], index) => (
              <OrderItem
                price={price}
                quantity={qty}
                key={`${index}`}
                variant={variant}
                relativeVolume={
                  maxQuantity > 0
                    ? parseFloat((parseFloat(qty) / maxQuantity).toFixed(2))
                    : 0
                }
              />
            ))
          : null}
        {Array(emptyRows)
          .fill(null)
          .map((_, index) => (
            <EmptyRow key={`${index}`} />
          ))}
      </div>
    </div>
  )
}
