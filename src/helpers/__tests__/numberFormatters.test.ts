import {
  formatPrice,
  formatQuantity,
  formatVolume,
  percentFormatter,
} from '../numberFormaters'

describe('formatPrice', () => {
  it('should format zero as "0.00"', () => {
    expect(formatPrice('0')).toEqual('0.00')
  })

  it('should handle non-numeric inputs gracefully', () => {
    expect(formatPrice('abc')).toEqual('0.00')
  })

  it('should maintain a minimum of two decimal places', () => {
    expect(formatPrice('1')).toEqual('1.00')
  })

  it('should format large numbers with up to eight decimals without trailing zeros', () => {
    expect(formatPrice('1234.567890123')).toEqual('1,234.56789012')
  })
})

describe('formatVolume', () => {
  it('should return "0" for non-numeric inputs', () => {
    expect(formatVolume('abc')).toEqual('0')
  })

  it('should format numbers less than one million without suffix', () => {
    expect(formatVolume('999999')).toEqual('999,999')
  })

  it('should format millions with "M" suffix', () => {
    expect(formatVolume('1000000')).toEqual('1.00M')
  })

  it('should format billions with "B" suffix', () => {
    expect(formatVolume('1000000000')).toEqual('1.00B')
  })
})

describe('percentFormatter', () => {
  it('should format 0.1 as "10.00%"', () => {
    expect(percentFormatter.format(0.1)).toEqual('10.00%')
  })

  it('should format 0.1234 as "12.34%"', () => {
    expect(percentFormatter.format(0.1234)).toEqual('12.34%')
  })
})

describe('formatQuantity', () => {
  it('should return "0" for non-numeric inputs', () => {
    expect(formatQuantity('abc')).toEqual('0')
  })

  it('should return "0" for empty string', () => {
    expect(formatQuantity('')).toEqual('0')
  })

  it('should format numbers to five decimals without trailing zeros', () => {
    expect(formatQuantity('123.4500010000')).toEqual('123.450001')
  })
})
