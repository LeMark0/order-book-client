export function formatPrice(value: string): string {
  const float = parseFloat(value)
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  })

  return isNaN(float) ? '0.00' : formatter.format(float)
}

// {
//         "symbol": "BTCUSDT",
//         "priceChange": "5206.02000000",
//         "priceChangePercent": "6.656",
//         "weightedAvgPrice": "79973.98202062",
//         "prevClosePrice": "78216.02000000",
//         "lastPrice": "83422.04000000",
//         "lastQty": "0.21427000",
//         "bidPrice": "83422.04000000",
//         "bidQty": "2.06078000",
//         "askPrice": "83422.05000000",
//         "askQty": "1.10893000",
//         "openPrice": "78216.02000000",
//         "highPrice": "83434.27000000",
//         "lowPrice": "76606.00000000",
//         "volume": "54309.88059000",
//         "quoteVolume": "4343377413.84661730",
//         "openTime": 1741632774722,
//         "closeTime": 1741719174722,
//         "firstId": 4695990977,
//         "lastId": 4703833727,
//         "count": 7842751
//     }

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

// Formatters for other fields
export const percentFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  style: 'percent',
})
