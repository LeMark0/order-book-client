type SubscriptionType = string

type UpdateSubscriptionOptions = {
  symbol: string
  subscriptionType: SubscriptionType
}
// TODO remove
export const updateSubscription = (
  subscriptions: string[],
  options: UpdateSubscriptionOptions,
): string[] => {
  const newSubscription = `${options.symbol}@${options.subscriptionType}`
  const index = subscriptions.findIndex((sub) =>
    sub.endsWith(`@${options.subscriptionType}`),
  )

  if (index !== -1) {
    return [
      ...subscriptions.slice(0, index),
      newSubscription,
      ...subscriptions.slice(index + 1),
    ]
  } else {
    return [...subscriptions, newSubscription]
  }
}
