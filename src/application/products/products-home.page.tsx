import React from 'react'
import { AppTabState } from '@application/AppCore'
import { useObserver } from 'mobx-react'
import ProductsDashboardComponent from '@components/products-dashboard.component'

interface Props {
  state: AppTabState
}

function ProductsHomePage(props: Props) {
  const { state } = props
  return useObserver(() => (
    <div className="bg-base-100 min-h-screen rounded-lg max-w-7xl mx-auto">
      <div className="p-6">
        <ProductsDashboardComponent
          products={state.builderProducts}
          hippoProducts={state.products}
          loading={state.loadingBuilderProducts || state.loadingProducts}
          className="w-full"
        />
      </div>
    </div>
  ))
}

export default ProductsHomePage
