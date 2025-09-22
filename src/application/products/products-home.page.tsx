import React from "react";
import { AppTabState } from "@application/AppCore";
import { useObserver } from "mobx-react";
import ProductsDashboardComponent from "@components/products-dashboard.component";

interface Props {
  state: AppTabState;
}

function ProductsHomePage(props: Props) {
  const { state } = props;
  const handleEditProduct = (productId: string) => {
    console.log('Edit product:', productId);
    // In a real app, this would navigate to an edit page or open a modal
    alert(`Edit product: ${productId}`);
  };

  const handleViewProduct = (productId: string) => {
    console.log('View product:', productId);
    // In a real app, this would navigate to a product detail page
    const product = state.builderProducts.find(p => p.id === productId);
    if (product?.data?.gh?.slug) {
      // You could navigate to the actual product page
      window.open(`/products/${product.data.gh.slug}`, '_blank');
    } else {
      alert(`View product: ${productId}`);
    }
  };

  const handleToggleVisibility = (productId: string, hidden: boolean) => {
    console.log('Toggle visibility:', productId, hidden);
  };

  const handleToggleStock = (productId: string, outOfStock: boolean) => {
    console.log('Toggle stock:', productId, outOfStock);
  };


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
  ));
}

export default ProductsHomePage;
