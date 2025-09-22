import React, { useMemo, useState } from 'react'
import {
  HiOutlineInformationCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineShoppingBag,
  HiOutlineStar,
} from 'react-icons/hi2'
import LoadingSection from '@components/loading-section.component'
import ProductDetailsModal from '@components/product-details-modal.component'
import { IProduct } from '@services/commerce-api/types'

interface ProductReviews {
  id: string
  count: number
  averageRating: number
}

interface ProductCategory {
  category: {
    id: string
    value: {
      data: {
        name: string
        slug: string
      }
    }
  }
}

interface ProductTag {
  tag: {
    value: {
      data: {
        name: string
        tagColor?: string
        pluralDisplayName?: string
      }
    }
  }
}

interface ProductUseCase {
  useCase: {
    value: {
      data: {
        name: string
        description?: string
      }
    }
  }
}

interface ProductIngredient {
  ingredient: {
    value: {
      data: {
        name: string
      }
    }
  }
}

interface ProductData {
  id: string
  name: string
  displayName?: string
  shortDescription?: string
  subHeading?: string
  hidden: boolean
  outOfStock: boolean
  upc?: string
  featuredImage?: string
  secondaryImage?: string
  reviews?: ProductReviews
  categories?: ProductCategory[]
  packagingLabels?: {
    singular: string
    plural: string
  }
  gh?: {
    slug: string
    productionId: string
    type: string
  }
  tags?: ProductTag[]
  useCases?: ProductUseCase[]
  ingredients?: ProductIngredient[]
  quote?: string
  altText?: string
  title?: string
}

export interface BuilderContentProduct {
  id: string
  name: string
  data: ProductData
}

interface ProductDashboardProps {
  products: BuilderContentProduct[]
  hippoProducts: IProduct[]
  loading: boolean
  className?: string
}

type SortField = 'name' | 'reviews' | 'stock'
type SortOrder = 'asc' | 'desc'
type FilterStatus = 'all' | 'visible' | 'hidden' | 'outOfStock' | 'inStock'

const ProductDashboard: React.FC<ProductDashboardProps> = ({ products, hippoProducts, loading, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('visible')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [detailsModalProduct, setDetailsModalProduct] = useState<BuilderContentProduct | null>(null)

  const availableCategories = useMemo(() => {
    const categoryMap = new Map<string, string>()
    if (!products || !Array.isArray(products)) return []
    products.forEach((product) => {
      if (product?.data?.categories && Array.isArray(product.data.categories)) {
        product.data.categories.forEach((cat) => {
          if (cat?.category?.value?.data?.name) {
            const categoryData = cat.category.value.data
            categoryMap.set(categoryData.name, categoryData.name)
          }
        })
      }
    })
    return Array.from(categoryMap.values()).sort()
  }, [products])

  const filteredAndSortedProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return []
    let filtered = [...products]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (product) =>
          product?.data?.name?.toLowerCase().includes(term) ||
          product?.data?.displayName?.toLowerCase().includes(term) ||
          product?.data?.shortDescription?.toLowerCase().includes(term) ||
          product?.data?.upc?.toLowerCase().includes(term),
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((product) => {
        if (!product?.data) return false
        switch (filterStatus) {
          case 'visible':
            return !product.data.hidden
          case 'hidden':
            return product.data.hidden
          case 'outOfStock':
            return product.data.outOfStock
          case 'inStock':
            return !product.data.outOfStock
          default:
            return true
        }
      })
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) =>
        product?.data?.categories?.some((cat) => cat?.category?.value?.data?.name === selectedCategory),
      )
    }

    filtered.sort((a, b) => {
      if (!a?.data || !b?.data) return 0
      let comparison = 0
      switch (sortField) {
        case 'name':
          comparison = (a.data.name || '').localeCompare(b.data.name || '')
          break
        case 'reviews':
          comparison = (a.data.reviews?.averageRating || 0) - (b.data.reviews?.averageRating || 0)
          break
        case 'stock':
          comparison = Number(a.data.outOfStock) - Number(b.data.outOfStock)
          break
        default:
          return 0
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [products, searchTerm, sortField, sortOrder, filterStatus, selectedCategory])

  const getStatusCounts = () => {
    if (!products || !Array.isArray(products)) {
      return { all: 0, visible: 0, hidden: 0, outOfStock: 0, inStock: 0 }
    }
    return {
      all: products.length,
      visible: products.filter((p) => p?.data && !p.data.hidden).length,
      hidden: products.filter((p) => p?.data && p.data.hidden).length,
      outOfStock: products.filter((p) => p?.data && p.data.outOfStock).length,
      inStock: products.filter((p) => p?.data && !p.data.outOfStock).length,
    }
  }

  const statusCounts = getStatusCounts()

  const getHippoProduct = (productSlug: string) => {
    return hippoProducts.find((product) => product.slug === productSlug)
  }

  const getRatingStars = (rating: number) => {
    const stars = [] as React.ReactNode[]
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<HiOutlineStar key={i} className="h-4 w-4 text-yellow-500 fill-current" />)
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<HiOutlineStar key={i} className="h-4 w-4 text-yellow-500 fill-current opacity-50" />)
      } else {
        stars.push(<HiOutlineStar key={i} className="h-4 w-4 text-base-content/20" />)
      }
    }
    return <div className="flex items-center gap-1">{stars}</div>
  }

  const openDetailsModal = (product: BuilderContentProduct) => {
    setDetailsModalProduct(product)
  }

  const onCloseModal = () => setDetailsModalProduct(null)

  const getProductImages = (
    product: BuilderContentProduct,
  ): { src: string; alt: string; type: 'featured' | 'secondary' }[] => {
    const images = [] as {
      src: string
      alt: string
      type: 'featured' | 'secondary'
    }[]
    if (product.data.featuredImage) {
      images.push({
        src: product.data.featuredImage,
        alt: `${product.data.name} - Featured`,
        type: 'featured',
      })
    }
    if (product.data.secondaryImage) {
      images.push({
        src: product.data.secondaryImage,
        alt: `${product.data.name} - Secondary`,
        type: 'secondary',
      })
    }
    return images
  }

  return (
    <div className={`bg-base-100 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-base-200 p-6 border-b border-base-300">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <HiOutlineShoppingBag className="h-6 w-6" />
            Product Dashboard
          </h1>
          <div className="text-sm text-base-content/60">
            {filteredAndSortedProducts.length} of {products.length} products
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <HiOutlineMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-base-content/40" />
            <input
              type="text"
              placeholder="Search products by name, description, or UPC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div>
              <label className="text-sm font-medium text-base-content/80 mb-1 block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="select select-bordered select-sm"
              >
                <option value="all">All Categories</option>
                {availableCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter Tabs */}
            <div>
              <label className="text-sm font-medium text-base-content/80 mb-1 block">Status</label>
              <div className="tabs tabs-box tabs-sm">
                <button
                  className={`tab ${filterStatus === 'all' ? 'tab-active' : ''}`}
                  onClick={() => setFilterStatus('all')}
                >
                  All ({statusCounts.all})
                </button>
                <button
                  className={`tab ${filterStatus === 'visible' ? 'tab-active' : ''}`}
                  onClick={() => setFilterStatus('visible')}
                >
                  Visible ({statusCounts.visible})
                </button>
                <button
                  className={`tab ${filterStatus === 'hidden' ? 'tab-active' : ''}`}
                  onClick={() => setFilterStatus('hidden')}
                >
                  Hidden ({statusCounts.hidden})
                </button>
                <button
                  className={`tab ${filterStatus === 'inStock' ? 'tab-active' : ''}`}
                  onClick={() => setFilterStatus('inStock')}
                >
                  In Stock ({statusCounts.inStock})
                </button>
                <button
                  className={`tab ${filterStatus === 'outOfStock' ? 'tab-active' : ''}`}
                  onClick={() => setFilterStatus('outOfStock')}
                >
                  Out of Stock ({statusCounts.outOfStock})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredAndSortedProducts && filteredAndSortedProducts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
          {filteredAndSortedProducts.map((product) => (
            <div key={product.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
              <figure className="h-40 overflow-hidden bg-base-200 flex items-center justify-center">
                {product.data?.featuredImage ? (
                  <img
                    src={product.data.featuredImage}
                    alt={product.data.name || 'Product'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-base-content/30">
                    <HiOutlineShoppingBag className="h-10 w-10 mb-1" />
                    <span className="text-xs">No Image</span>
                  </div>
                )}
              </figure>
              <div className="card-body p-4">
                <div className="mb-2">
                  <h3 className="card-title text-base line-clamp-2">{product.data?.name || 'Unnamed Product'}</h3>
                </div>

                {product.data?.shortDescription && (
                  <p className="text-sm text-base-content/70 line-clamp-3">{product.data.shortDescription}</p>
                )}

                {/* Status chips */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <div
                    className={`badge badge-outline badge-xs ${product.data?.hidden ? 'text-error border-error' : 'text-success border-success'}`}
                  >
                    {product.data?.hidden ? 'Hidden' : 'Visible'}
                  </div>
                  <div
                    className={`badge badge-outline badge-xs ${product.data?.outOfStock ? 'text-warning border-warning' : 'text-info border-info'}`}
                  >
                    {product.data?.outOfStock ? 'Out of Stock' : 'In Stock'}
                  </div>
                </div>

                {/* Categories */}
                {product.data?.categories && product.data.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {product.data.categories.slice(0, 3).map((cat, i) => (
                      <div key={i} className="badge badge-outline badge-xs">
                        {cat?.category?.value?.data?.name}
                      </div>
                    ))}
                    {product.data.categories.length > 3 && (
                      <div className="badge badge-outline badge-xs">+{product.data.categories.length - 3}</div>
                    )}
                  </div>
                )}

                {/* Reviews */}
                {product.data?.reviews && product.data.reviews.count > 0 && (
                  <div className="mt-2">
                    {getRatingStars(product.data.reviews.averageRating)}
                    <div className="text-xs text-base-content/60">
                      {product.data.reviews.averageRating.toFixed(1)} ({product.data.reviews.count.toLocaleString()}{' '}
                      reviews)
                    </div>
                  </div>
                )}

                <div className="card-actions justify-end mt-3">
                  <button className="btn btn-secondary btn-sm gap-1" onClick={() => openDetailsModal(product)}>
                    <HiOutlineInformationCircle className="h-4 w-4" />
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredAndSortedProducts.length === 0 && (
        <div>
          {loading && (
            <div className="text-center py-12">
              <HiOutlineShoppingBag className="h-12 w-12 text-base-content/30 mx-auto mb-4" />
              <LoadingSection size={'sm'} />
              <p className="text-sm text-base-content/50">Loading Products...</p>
            </div>
          )}
          {!loading && (
            <div className="text-center py-12">
              <HiOutlineShoppingBag className="h-12 w-12 text-base-content/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-base-content/60 mb-2">No Products Found</h3>
              <p className="text-sm text-base-content/50">
                {searchTerm || filterStatus !== 'all' || selectedCategory !== 'all'
                  ? 'No products match the current filters. Try adjusting your search criteria.'
                  : 'No products available to display.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Product Details Modal */}
      {detailsModalProduct && (
        <ProductDetailsModal
          product={detailsModalProduct}
          commerceProduct={getHippoProduct(detailsModalProduct.data?.gh?.slug ?? '')}
          onClose={onCloseModal}
          images={getProductImages(detailsModalProduct)}
        />
      )}
    </div>
  )
}

export default ProductDashboard
