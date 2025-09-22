import React, { useMemo, useState } from 'react'
import { IProduct, IProductVariant } from '@services/commerce-api/types'

interface PricingTableProps {
  product: IProduct
  className?: string
}

const ProductPricingTable: React.FC<PricingTableProps> = ({ product, className = '' }) => {
  const [selectedPurchaseType, setSelectedPurchaseType] = useState<'oneTime' | 'subscription'>('oneTime')
  const { retailPrice, products: pricingData } = product
  const hasOneTime = [...pricingData.oneTime.standard, ...pricingData.oneTime.myAccount].length > 0
  const hasSubscription = [...pricingData.subscription.standard, ...pricingData.subscription.myAccount].length > 0

  // Get current pricing options based on selected purchase type
  const currentOptions: IProductVariant[] = useMemo(() => {
    const options = pricingData[selectedPurchaseType]
    // Combine standard and myAccount options, prioritizing myAccount
    const allOptions = [...options.standard, ...options.myAccount]
    // Sort by quantity
    return allOptions.sort((a, b) => a.quantity - b.quantity)
  }, [pricingData, selectedPurchaseType])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const formatSavings = (savings: number) => {
    if (savings <= 0) return null
    return `${formatPrice(savings)}`
  }

  return (
    <div className={`bg-base-100 rounded-lg overflow-hidden ${className}`}>
      {/* Purchase Type Toggle */}
      <div className="p-4 bg-base-200 border-b border-base-300">
        <div className="flex items-center justify-center">
          <div className="tabs tabs-box">
            {hasOneTime && (
              <button
                disabled={!hasSubscription}
                className={`tab ${selectedPurchaseType === 'oneTime' ? 'tab-active' : ''}`}
                onClick={() => setSelectedPurchaseType('oneTime')}
              >
                One-Time Purchase
              </button>
            )}
            {hasSubscription && (
              <button
                disabled={!hasOneTime}
                className={`tab ${selectedPurchaseType === 'subscription' ? 'tab-active' : ''}`}
                onClick={() => setSelectedPurchaseType('subscription')}
              >
                Subscription
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th className="text-left">Login Type</th>
              <th className="text-center">Quantity</th>
              <th className="text-right">Price</th>
              <th className="text-right">Retail Price</th>
              <th className="text-right">Savings</th>
            </tr>
          </thead>
          <tbody>
            {currentOptions.length > 0 ? (
              currentOptions.map((option, index) => (
                <tr key={`${option.variantId}-${index}`} className="hover:bg-base-50">
                  <td>
                    <div className="flex items-center gap-2">
                      <div
                        className={`badge badge-sm ${
                          option.priceLevel === 'MyAccount' ? 'badge-primary' : 'badge-neutral'
                        }`}
                      >
                        {option.priceLevel === 'MyAccount' ? 'My Account' : 'Standard'}
                      </div>
                    </div>
                  </td>
                  <td className="text-center font-medium">
                    {option.quantity} {option.packageType}
                  </td>
                  <td className="text-right">
                    <div className="font-semibold text-lg">{formatPrice(option.price)}</div>
                    {option.quantity > 1 && (
                      <div className="text-xs text-base-content/60">
                        {formatPrice(option.price / option.quantity)} each
                      </div>
                    )}
                  </td>
                  <td className="text-right italic">
                    <div className="text-base-content/80">{formatPrice(option.quantity * retailPrice)}</div>
                    {option.quantity > 1 && (
                      <div className="text-xs text-base-content/60">
                        {formatPrice((option.quantity * retailPrice) / option.quantity)} each
                      </div>
                    )}
                  </td>

                  <td className="text-right">
                    {option.savings ? (
                      <div className="badge badge-success badge-sm">{formatSavings(option.savings)}</div>
                    ) : (
                      <span className="text-base-content/40">—</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-base-content/60">
                  No pricing options available for{' '}
                  {selectedPurchaseType === 'oneTime' ? 'one-time purchase' : 'subscription'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductPricingTable
