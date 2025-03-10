import { updateSubscription } from '../updateSubscription'

describe('updateSubscription', () => {
  it('should add a new subscription if none exists for the type', () => {
    const subscriptions = ['news@daily', 'weather@hourly']
    const options = { symbol: 'sports', subscriptionType: 'monthly' }
    const expected = ['news@daily', 'weather@hourly', 'sports@monthly']
    const result = updateSubscription(subscriptions, options)
    expect(result).toEqual(expected)
  })

  it('should update an existing subscription if one exists for the type', () => {
    const subscriptions = ['news@daily', 'weather@hourly']
    const options = { symbol: 'climate', subscriptionType: 'hourly' }
    const expected = ['news@daily', 'climate@hourly']
    const result = updateSubscription(subscriptions, options)
    expect(result).toEqual(expected)
  })

  it('should not modify the original array', () => {
    const subscriptions = ['news@daily', 'weather@hourly']
    const options = { symbol: 'weather', subscriptionType: 'hourly' }
    updateSubscription(subscriptions, options)
    expect(subscriptions).toEqual(['news@daily', 'weather@hourly'])
  })

  it('should handle an empty subscription array correctly', () => {
    const subscriptions: string[] = []
    const options = { symbol: 'tech', subscriptionType: 'daily' }
    const expected = ['tech@daily']
    const result = updateSubscription(subscriptions, options)
    expect(result).toEqual(expected)
  })

  it('should update only the first occurrence if multiple subscriptions exist with the same type', () => {
    const subscriptions = ['news@daily', 'news@daily', 'weather@hourly']
    const options = { symbol: 'current', subscriptionType: 'daily' }
    const expected = ['current@daily', 'news@daily', 'weather@hourly']
    const result = updateSubscription(subscriptions, options)
    expect(result).toEqual(expected)
  })
})
