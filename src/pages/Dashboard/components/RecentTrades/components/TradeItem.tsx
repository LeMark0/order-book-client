import { formatPrice } from '@/helpers/numberFormaters'

type Props = {
  isBuyerMaker: boolean
  price: string
  quantity: string
  time: number
}

export const TradeItem = ({ isBuyerMaker, time, quantity, price }: Props) => {
  const textColor = isBuyerMaker ? 'text-green-500' : 'text-red-500'

  return (
    <div className="flex justify-between items-center p-2 rounded-md h-8 hover:bg-muted/20">
      <span className={`w-1/4 font-medium ${textColor}`}>
        {isBuyerMaker ? 'Buy' : 'Sell'}
      </span>
      <span className={`w-1/4 text-right ${textColor}`}>{formatPrice(price)}</span>
      <span className="w-1/4 text-right text-primary">{formatPrice(quantity)}</span>
      <span className="w-1/4 text-right text-secondary">
        {new Date(time).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
      </span>
    </div>
  )
}
