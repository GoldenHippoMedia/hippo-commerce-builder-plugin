import { BuilderContentProduct } from '@components/products-dashboard.component'
import {
  HiOutlineBeaker,
  HiOutlineClipboardDocumentList,
  HiOutlineGlobeAlt,
  HiOutlineInformationCircle,
  HiOutlineListBullet,
  HiOutlinePencil,
  HiOutlineStar,
  HiOutlineTag,
  HiOutlineXMark,
} from 'react-icons/hi2'
import React, { useState } from 'react'
import { IProduct } from '@services/commerce-api/types'
import ProductPricingTable from '@components/product-pricing-table.component'

interface ProductDetailsModalProps {
  product: BuilderContentProduct
  commerceProduct?: IProduct
  onClose: () => void
  images: { src: string; alt: string; type: 'featured' | 'secondary' }[]
}

function ProductDetailsModal({ product, commerceProduct, onClose, images }: ProductDetailsModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const getRatingStars = (rating: number) => {
    const stars = []
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

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-5xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <HiOutlineInformationCircle className="h-5 w-5" />
            Product Details
          </h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            <HiOutlineXMark className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Header Section with Image Carousel and Basic Info */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Image Carousel */}
            {(() => {
              if (images.length === 0) return null

              return (
                <div className="flex-shrink-0">
                  <div className="relative">
                    {/* Main Image Display */}
                    <div className="w-48 h-48 bg-base-200 rounded-lg overflow-hidden flex items-center justify-center">
                      {images[currentImageIndex]?.src ? (
                        <img
                          src={images[currentImageIndex].src}
                          alt={images[currentImageIndex].alt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="text-base-content/40 text-sm">No Image</div>
                      )}
                    </div>

                    {/* Navigation Arrows - Only show if multiple images */}
                    {images.length > 1 && (
                      <>
                        <div
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setCurrentImageIndex(currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1)
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center cursor-pointer z-10 select-none"
                        >
                          <span className="text-white text-sm leading-none">❮</span>
                        </div>
                        <div
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setCurrentImageIndex(currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1)
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center cursor-pointer z-10 select-none"
                        >
                          <span className="text-white text-sm leading-none">❯</span>
                        </div>
                      </>
                    )}

                    {/* Image Type Indicator */}
                    <div className="absolute bottom-2 left-2">
                      <div className="badge badge-sm bg-black/50 text-white border-none">
                        {images[currentImageIndex]?.type === 'featured' ? 'Featured' : 'Secondary'}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}

            <div className="flex-grow">
              <h4 className="text-xl font-bold mb-2">
                {product.data.displayName ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product.data.displayName,
                    }}
                  />
                ) : (
                  product.data.name
                )}
              </h4>
              {product.data.subHeading && (
                <div
                  className="text-base-content/70 mb-2"
                  dangerouslySetInnerHTML={{
                    __html: product.data.subHeading,
                  }}
                />
              )}
              {product.data.shortDescription && (
                <p className="text-sm text-base-content/80">{product.data.shortDescription}</p>
              )}
            </div>
          </div>

          {/* Tags */}
          {product.data.tags && Array.isArray(product.data.tags) && product.data.tags.length > 0 && (
            <div>
              <h5 className="font-semibold mb-2 flex items-center gap-1">
                <HiOutlineTag className="h-4 w-4" />
                Tags
              </h5>
              <div className="flex flex-wrap gap-2">
                {product.data.tags.map((tag, index) => {
                  if (!tag?.tag?.value?.data?.name) return null
                  return (
                    <div
                      key={index}
                      className="badge badge-outline"
                      style={{
                        backgroundColor: tag.tag.value.data.tagColor || undefined,
                      }}
                    >
                      {tag.tag.value.data.name}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Categories */}
          {product.data.categories && Array.isArray(product.data.categories) && product.data.categories.length > 0 && (
            <div>
              <h5 className="font-semibold mb-2 flex items-center gap-1">
                <HiOutlineListBullet className="h-4 w-4" />
                Categories
              </h5>
              <div className="flex flex-wrap gap-2">
                {product.data.categories.map((cat, index) => {
                  if (!cat?.category?.value?.data?.name) return null
                  return (
                    <div key={index} className="badge badge-primary badge-outline">
                      {cat.category.value.data.name}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Use Cases */}
          {product.data.useCases && Array.isArray(product.data.useCases) && product.data.useCases.length > 0 && (
            <div>
              <h5 className="font-semibold mb-2 flex items-center gap-1">
                <HiOutlineClipboardDocumentList className="h-4 w-4" />
                Use Cases
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {product.data.useCases.map((useCase, index) => {
                  if (!useCase?.useCase?.value?.data?.name) return null
                  return (
                    <div key={index} className="p-3 bg-base-200 rounded-lg">
                      <div className="font-medium">{useCase.useCase.value.data.name}</div>
                      {useCase.useCase.value.data.description && (
                        <div className="text-sm text-base-content/70 mt-1">
                          {useCase.useCase.value.data.description}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Ingredients */}
          {product.data.ingredients &&
            Array.isArray(product.data.ingredients) &&
            product.data.ingredients.length > 0 && (
              <div>
                <h5 className="font-semibold mb-2 flex items-center gap-1">
                  <HiOutlineBeaker className="h-4 w-4" />
                  Key Ingredients
                </h5>
                <div className="flex flex-wrap gap-2">
                  {product.data.ingredients.map((ingredient, index) => {
                    if (!ingredient?.ingredient?.value?.data?.name) {
                      return null
                    }
                    return (
                      <div key={index} className="badge badge-secondary badge-outline">
                        {ingredient.ingredient.value.data.name}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

          {/* Quote */}
          {product.data.quote && (
            <div>
              <h5 className="font-semibold mb-2">Guru Quote</h5>
              <div
                className="p-4 bg-base-200 rounded-lg italic"
                dangerouslySetInnerHTML={{
                  __html: product.data.quote,
                }}
              />
            </div>
          )}

          {/* Technical Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-semibold mb-2">Technical Details</h5>
              <div className="space-y-1 text-sm">
                {product.data.upc && (
                  <div>
                    <span className="font-medium">UPC:</span> {product.data.upc}
                  </div>
                )}
                {product.data.packagingLabels && (
                  <div>
                    <span className="font-medium">Packaging:</span> {product.data.packagingLabels.singular} /{' '}
                    {product.data.packagingLabels.plural}
                  </div>
                )}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h5 className="font-semibold mb-2">Customer Reviews</h5>
              {product.data.reviews && product.data.reviews.count > 0 ? (
                <div className="space-y-2">
                  {getRatingStars(product.data.reviews.averageRating)}
                  <div className="text-sm text-base-content/80">
                    {product.data.reviews.averageRating.toFixed(1)} out of 5 (
                    {product.data.reviews.count.toLocaleString()} reviews)
                  </div>
                </div>
              ) : (
                <div className="text-sm text-base-content/50">No reviews available</div>
              )}
            </div>
          </div>

          {/* External References */}
          {product.data.gh && (
            <div>
              <h5 className="font-semibold mb-2 flex items-center gap-1">
                <HiOutlineGlobeAlt className="h-4 w-4" />
                External References
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Slug:</span> {product.data.gh.slug}
                </div>
                <div>
                  <span className="font-medium">Hippo ID:</span> {product.data.gh.productionId}
                </div>
              </div>
            </div>
          )}
        </div>

        {commerceProduct && (
          <div className={'my-4'}>
            <h5 className={'font-semibold mb-2'}>Pricing</h5>
            <ProductPricingTable product={commerceProduct} />
          </div>
        )}

        <div className="modal-action">
          <div className="flex flex-wrap gap-2 flex-1">
            <a
              href={`/content/${product.id}`}
              target={'_blank'}
              rel="noopener noreferrer"
              className="btn btn-info btn-sm gap-1"
            >
              <HiOutlinePencil className="h-4 w-4" />
              Edit Product
            </a>
          </div>
          <button onClick={onClose} className="btn">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailsModal
