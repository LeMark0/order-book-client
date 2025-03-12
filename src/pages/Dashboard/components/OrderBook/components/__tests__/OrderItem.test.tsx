import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { OrderItem } from '../OrderItem'

describe('OrderItem', () => {
  it('should display formatted price and quantity', () => {
    render(
      <OrderItem
        price="1234.56"
        quantity="789.12345"
        variant="ask"
        relativeVolume={0.5}
      />,
    )
    expect(screen.getByText(/1,234.56/)).toBeInTheDocument()
    expect(screen.getByText(/789.12345/)).toBeInTheDocument()
  })

  it('should apply correct text color for bid variant', () => {
    render(
      <OrderItem
        price="1234.56"
        quantity="789.12345"
        variant="bid"
        relativeVolume={0.3}
      />,
    )
    const priceSpan = screen.getByText(/1,234.56/)
    expect(priceSpan).toHaveClass('text-green-500')
    const value = screen.getByText(/1,234.56/)
    expect(value).toHaveClass('text-green-500')
  })

  it('should handle minimum and maximum relative volume bounds', () => {
    const { rerender } = render(
      <OrderItem
        price="1234.56"
        quantity="789.12345"
        variant="ask"
        relativeVolume={-0.1}
      />,
    )
    let bar = screen.getByTestId('order-item-bar')
    expect(bar).toHaveStyle('width: 0%')

    rerender(
      <OrderItem
        price="1234.56"
        quantity="789.12345"
        variant="ask"
        relativeVolume={1.5}
      />,
    )
    bar = screen.getByTestId('order-item-bar')
    expect(bar).toHaveStyle('width: 100%')
  })
})
