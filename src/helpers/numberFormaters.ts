export function formatPrice(value: string): string {
  const float = parseFloat(value)
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  })

  return isNaN(float) ? '0.00' : formatter.format(float)
}

export function formatVolume(value: string): string {
  const float = parseFloat(value)
  if (isNaN(float)) return '0'

  const formatter = new Intl.NumberFormat('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  if (float >= 1_000_000_000) {
    // Billions
    return `${formatter.format(float / 1_000_000_000)}B`
  }

  if (float >= 1_000_000) {
    // Millions
    return `${formatter.format(float / 1_000_000)}M`
  }

  return new Intl.NumberFormat('en-GB', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(float)
}

export const percentFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  style: 'percent',
})

export function formatQuantity(value: string): string {
  if (!value || isNaN(parseFloat(value))) {
    return '0'
  }

  const num = parseFloat(value)

  return num.toFixed(8).replace(/\.?0+$/, '')
}
