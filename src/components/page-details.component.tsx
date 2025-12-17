import {
  HiCheckCircle,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineExternalLink,
  HiOutlineLink,
  HiOutlineUser,
  HiPencil,
  HiXCircle,
} from 'react-icons/hi'
import { HiExclamationTriangle, HiOutlineExclamationTriangle } from 'react-icons/hi2'
import { PageDetails, ValidationIssue, ValidationWarning } from '@utils/utils.interfaces'
import React from 'react'
import Utils from '@utils/index'
import StarRating from '@components/star-rating.component'
import { IProduct } from '@services/commerce-api/types'
import { PdpTypes } from '@core/models/page/page.model'
import Slider from '@components/slider.component'
import clsx from 'clsx'
import ProductPricingTable from '@components/product-pricing-table.component'

interface Props {
  page: PageDetails
  onClose: () => void
  products: IProduct[]
}

function PageDetailCard(props: Props) {
  const { page, products } = props

  // Format date helper
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  // Group issues and warnings by error type
  const groupedValidationItems = React.useMemo(() => {
    const groups: Record<string, Array<{ original: string | any; details: any }>> = {
      SEO: [],
      General: [],
      Blog: [],
      Product: [],
    }

    // Process issues
    page.issues.forEach((issue) => {
      const details = Utils.errorDetails(issue as ValidationIssue)
      const group = groups[details.errorType] || groups.General
      group.push({ original: issue, details })
    })

    // Process warnings
    page.warnings.forEach((warning) => {
      const details = Utils.errorDetails(warning as ValidationWarning)
      const group = groups[details.errorType] || groups.General
      group.push({ original: warning, details })
    })

    // Filter out empty groups
    return Object.entries(groups).filter(([_, items]) => items.length > 0)
  }, [page.issues, page.warnings])
  const isBlogPage = page.pageType === 'Blog'
  const isProductPage = page.pageType === 'Product'
  const blogInfo = isBlogPage ? page.blog : null
  const pdpInfo = isProductPage ? page.pdp : null
  const hasTrial = isProductPage && (pdpInfo?.productDetails?.flavorsOrSizes ?? []).some((p) => p.trialSize)

  const groupProducts: IProduct[] =
    isProductPage && pdpInfo && pdpInfo.productDetails?.flavorsOrSizes
      ? pdpInfo.productDetails.flavorsOrSizes
          .map((p) => Utils.getProductFromCatalog(p.slug, products))
          .filter((productInfo): productInfo is IProduct => productInfo !== undefined)
      : []
  const nonTrialProduct =
    hasTrial && groupProducts.length === 2
      ? pdpInfo?.productDetails?.flavorsOrSizes.find((p) => !p.trialSize)
      : undefined
  const singleProduct: IProduct | undefined =
    isProductPage && pdpInfo?.type === PdpTypes.PRODUCT
      ? Utils.getProductFromCatalog(pdpInfo.productDetails?.slug ?? '', products)
      : nonTrialProduct
        ? groupProducts.find((p) => p.slug === nonTrialProduct.slug)
        : undefined

  return (
    <div className="card bg-base-100 overflow-hidden w-full backdrop:bg-primary">
      {/* Header Section with Image */}
      <div className="w-full">
        <div className="bg-primary text-primary-content pt-6 pb-4 pl-4">
          <div className="badge mb-2">{page.pageType}</div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">{page.title}</h1>
        </div>
      </div>

      <div className="card-body p-6 lg:p-8">
        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="w-full p-2">
            <div className="text-xs text-base-content/60 mb-2">SEO Image</div>
            {page.thumbnail && (
              <div className="relative rounded-lg overflow-hidden bg-base-200">
                <img
                  src={page.thumbnail}
                  alt={page.title || 'Page thumbnail'}
                  className="w-full h-64 lg:h-80 object-cover"
                />
                <a
                  href={page.thumbnail}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-2 right-2 btn btn-sm btn-circle btn-ghost bg-black/50 text-white hover:bg-black/70"
                >
                  <HiOutlineExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
            {!page.thumbnail && (
              <div className={'text-sm font-medium text-error wrap-break-word mr-2'}>No SEO Image found.</div>
            )}
          </div>
          <div className={'w-full flex-col gap-4'}>
            <div className="flex items-center gap-3 w-full">
              <HiOutlineDocumentText className="h-5 w-5 text-base-content/60" />
              <div>
                <div className="text-xs text-base-content/60">SEO Title</div>
                {page.seoTitle && page.seoTitle.length > 0 && (
                  <div className="text-sm font-medium wrap-break-word mr-2">{page.seoTitle}</div>
                )}
                {(!page.seoTitle || page.seoTitle === '') && (
                  <div className="text-sm font-medium text-error mr-2">No SEO Title Provided.</div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 w-full">
              <HiOutlineDocumentText className="h-5 w-5 text-base-content/60" />
              <div className={'w-full'}>
                <div className="text-xs text-base-content/60">SEO Description</div>
                {page.description && page.description.length > 0 && (
                  <div>
                    <div className="text-sm font-medium wrap-break-word mr-2">{page.description}</div>
                  </div>
                )}
                {(!page.description || page.description === '') && (
                  <div className="text-sm font-medium text-error mr-2">No SEO Description Provided.</div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HiOutlineLink className="h-5 w-5 text-base-content/60" />
              <div>
                <div className="text-xs text-base-content/60">Path</div>
                <div className="text-sm font-medium">{page.path}</div>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <HiOutlineClock className="h-5 w-5 text-base-content/60" />
              <div>
                <div className="text-xs text-base-content/60">Last Updated</div>
                <div className="text-sm font-medium">{formatDate(page.lastUpdated)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Validation Status Section */}
        <div className="border-t border-base-200 pt-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Validation Status</h2>
            <div className="flex items-center gap-2">
              {page.validationStatus === 'valid' && (
                <div className="badge badge-success gap-1">
                  <HiCheckCircle className="h-4 w-4" />
                  Valid - No Issues
                </div>
              )}

              {page.validationStatus === 'warning' && (
                <div className="badge badge-warning gap-1">
                  <HiExclamationTriangle className="h-4 w-4" />
                  {page.warnings.length} Warning
                  {page.warnings.length !== 1 ? 's' : ''}
                </div>
              )}

              {page.validationStatus === 'invalid' && (
                <>
                  <div className="badge badge-error gap-1">
                    <HiXCircle className="h-4 w-4" />
                    {page.issues.length} Issue
                    {page.issues.length !== 1 ? 's' : ''}
                  </div>
                  {page.warnings.length > 0 && (
                    <div className="badge badge-warning gap-1">
                      <HiOutlineExclamationTriangle className="h-4 w-4" />
                      {page.warnings.length} Warning
                      {page.warnings.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Grouped Validation Items */}
          {groupedValidationItems.length > 0 && (
            <div className="space-y-4">
              {groupedValidationItems.map(([errorType, items]) => (
                <div key={errorType} className="rounded-lg border border-base-300 overflow-hidden">
                  <div className="bg-base-200 px-4 py-2 font-medium text-sm">
                    {errorType} {errorType === 'SEO' ? 'Page' : 'Issues'}
                  </div>
                  <div className="p-4 space-y-2">
                    {items.map((item, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-3 p-3 rounded-lg ${
                          item.details.severity === 'issue'
                            ? 'bg-error/70 text-error-content'
                            : 'bg-warning/70 text-warning-content'
                        }`}
                      >
                        {item.details.severity === 'issue' ? (
                          <HiXCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        ) : (
                          <HiExclamationTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="text-sm">{item.details.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {page.validationStatus === 'valid' && (
            <div className="bg-success/70 text-success-content rounded-lg p-4 flex items-center gap-3">
              <HiCheckCircle className="h-6 w-6" />
              <div>
                <div className="font-medium">All validation checks passed.</div>
              </div>
            </div>
          )}
        </div>

        {/* Blog Details Section */}
        {isBlogPage && blogInfo && (
          <div className="border-t border-base-200 pt-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <HiOutlineDocumentText className="h-5 w-5" />
              Blog Details
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Blog Thumbnail */}
              {blogInfo.thumbnail && (
                <div className="lg:row-span-2">
                  <div className="text-xs text-base-content/60 mb-2">Blog Featured Image</div>
                  <div className="relative rounded-lg overflow-hidden bg-base-200">
                    <img
                      src={blogInfo.thumbnail}
                      alt={blogInfo.title || 'Blog thumbnail'}
                      className="w-full h-64 lg:h-80 object-cover"
                    />
                    <a
                      href={blogInfo.thumbnail}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 right-2 btn btn-sm btn-circle btn-ghost bg-black/50 text-white hover:bg-black/70"
                    >
                      <HiOutlineExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              )}

              {/* Blog Metadata */}
              <div className="space-y-4">
                {blogInfo.title && (
                  <div>
                    <div className="text-xs text-base-content/60 mb-1">Blog Title</div>
                    <div className="font-medium text-lg">{blogInfo.title}</div>
                  </div>
                )}

                {blogInfo.author && (
                  <div className="flex items-center gap-3">
                    <HiOutlineUser className="h-5 w-5 text-base-content/60" />
                    <div>
                      <div className="text-xs text-base-content/60">Author</div>
                      <div className="text-sm font-medium">{blogInfo.author}</div>
                    </div>
                  </div>
                )}

                {blogInfo.publicationDate && (
                  <div className="flex items-center gap-3">
                    <HiOutlineCalendar className="h-5 w-5 text-base-content/60" />
                    <div>
                      <div className="text-xs text-base-content/60">Publication Date</div>
                      <div className="text-sm font-medium">{formatDate(blogInfo.publicationDate)}</div>
                    </div>
                  </div>
                )}

                {blogInfo.snippet && (
                  <div>
                    <div className="text-xs text-base-content/60 mb-1">Blog Snippet</div>
                    <div className="bg-base-200 rounded-lg p-4 text-sm leading-relaxed">{blogInfo.snippet}</div>
                  </div>
                )}

                {/* Categories */}
                {blogInfo.categories.length > 0 && (
                  <div>
                    <div className="text-xs text-base-content/60 mb-1">Categories</div>
                    <div className="flex flex-wrap gap-1">
                      {blogInfo.categories.map((category) => (
                        <div key={category.id} className="badge badge-primary badge-sm">
                          {category.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PDP Details Section */}
        {isProductPage && pdpInfo && (
          <div className="border-t border-base-200 pt-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <HiOutlineDocumentText className="h-5 w-5" />
              PDP Details
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Image */}
              {pdpInfo.slides.length > 0 && (
                <div className="lg:row-span-3">
                  <div className="text-xs text-base-content/60 mb-2">Slider Images</div>
                  <div className="relative rounded-lg overflow-hidden bg-base-200">
                    <Slider
                      className={'max-h-96'}
                      items={pdpInfo.slides.map((slide) => ({
                        url: slide,
                        altText: slide,
                      }))}
                    />
                  </div>
                </div>
              )}
              {/* Product Metadata */}
              <div className="space-y-4">
                {/* Product Name and Type */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="badge badge-outline">{pdpInfo.type}</div>
                  </div>
                  {pdpInfo.name && (
                    <div className="font-semibold text-xl mb-1">
                      <div dangerouslySetInnerHTML={{ __html: pdpInfo.name }} />
                    </div>
                  )}
                  {pdpInfo.subHeading && (
                    <div className="text-sm text-base-content/70">
                      <div dangerouslySetInnerHTML={{ __html: pdpInfo.subHeading }} />
                    </div>
                  )}
                </div>

                {/* Description */}
                {pdpInfo.description && (
                  <div>
                    <div className="text-xs text-base-content/60 mb-1">Description</div>
                    <div className="bg-base-200 rounded-lg p-3 text-sm leading-relaxed">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: pdpInfo.description,
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Reviews */}
                {pdpInfo.productDetails && (
                  <div>
                    <div className="text-xs text-base-content/60 mb-1">Reviews</div>
                    <div className="flex items-center gap-2">
                      <StarRating rating={pdpInfo.productDetails.reviews.average} variant={'primary'} />
                      <span className="text-sm font-medium">{pdpInfo.productDetails.reviews.average.toFixed(2)}</span>
                      <span className="text-sm text-base-content/60">
                        ({pdpInfo.productDetails.reviews.count.toLocaleString()} reviews)
                      </span>
                    </div>
                  </div>
                )}

                {/* Categories */}
                {pdpInfo.productDetails?.categories && pdpInfo.productDetails.categories.length > 0 && (
                  <div>
                    <div className="text-xs text-base-content/60 mb-1">Categories</div>
                    <div className="flex flex-wrap gap-1">
                      {pdpInfo.productDetails.categories.map((category) => (
                        <div key={category.id} className="badge badge-primary badge-sm">
                          {category.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ingredients */}
                {pdpInfo.productDetails?.ingredients && pdpInfo.productDetails.ingredients.length > 0 && (
                  <div>
                    <div className="text-xs text-base-content/60 mb-1">Ingredients</div>
                    <div className="flex flex-wrap gap-1">
                      {pdpInfo.productDetails.ingredients.map((ingredient) => (
                        <div key={ingredient.id} className="badge badge-secondary badge-sm">
                          {ingredient.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Use Cases */}
                {pdpInfo.productDetails?.useCases && pdpInfo.productDetails.useCases.length > 0 && (
                  <div>
                    <div className="text-xs text-base-content/60 mb-1">Use Cases</div>
                    <div className="flex flex-wrap gap-1">
                      {pdpInfo.productDetails.useCases.map((useCase) => (
                        <div key={useCase.id} className="badge badge-accent badge-sm">
                          {useCase.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {pdpInfo.productDetails?.tags && pdpInfo.productDetails.tags.length > 0 && (
                  <div>
                    <div className="text-xs text-base-content/60 mb-1">Tags</div>
                    <div className="flex flex-wrap gap-1">
                      {pdpInfo.productDetails.tags.map((tag) => (
                        <div key={tag.id} className="badge badge-info badge-sm">
                          {tag.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {singleProduct && (
                  <div className={'grid grid-cols-2 gap-2 lg:grid-cols-4'}>
                    <div>
                      <div className="text-xs text-base-content/60 mb-1">Retail Price</div>
                      <div className="text-sm">${singleProduct.retailPrice.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-base-content/60 mb-1">Tax Code</div>
                      <div className="text-sm">{singleProduct.taxCode}</div>
                    </div>
                    <div>
                      <div className="text-xs text-base-content/60 mb-1">Packaging Label</div>
                      <div className="text-sm">
                        {singleProduct.packaging.singular} / {singleProduct.packaging.plural}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-base-content/60 mb-1">UPC</div>
                      <div className="text-sm">
                        {singleProduct.upc && singleProduct.upc.length > 0 ? singleProduct.upc : 'No UPC'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-base-content/60 mb-1">In Stock</div>
                      <div
                        className={clsx('text-sm', {
                          'text-error': singleProduct.outOfStock,
                          'text-success': !singleProduct.outOfStock,
                        })}
                      >
                        {singleProduct.outOfStock ? 'NO' : 'YES'}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-base-content/60 mb-1">Hippo Id</div>
                      <div className="text-sm">{singleProduct.id}</div>
                    </div>
                    {singleProduct.outOfStock && singleProduct.restockEta && (
                      <div>
                        <div className="text-xs text-base-content/60 mb-1">Restock ETA</div>
                        <div className="text-sm">{new Date(singleProduct.restockEta).toLocaleDateString()}</div>
                      </div>
                    )}
                    {singleProduct.restrictedCountries.length > 0 && (
                      <div className={'col-span-2'}>
                        <div className="text-xs text-base-content/60 mb-1">Restricted Countries</div>
                        <div className="text-sm">
                          <ul>
                            {singleProduct.restrictedCountries.map((country) => (
                              <li key={country.code}>{country.name}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {singleProduct && pdpInfo.type === PdpTypes.PRODUCT && (
                <div className={'mt-6'}>
                  <ProductPricingTable product={singleProduct} />
                </div>
              )}
            </div>

            {pdpInfo.type === 'Product Group' &&
              pdpInfo.productDetails?.flavorsOrSizes &&
              pdpInfo.productDetails.flavorsOrSizes.length > 0 && (
                <div className="mt-6">
                  <div className="text-sm font-medium flex items-center gap-2">
                    Available Options
                    {pdpInfo.productDetails.includesTrial && (
                      <div className="badge badge-info badge-sm">Includes Trial</div>
                    )}
                  </div>
                  <div className={'text-xs italic ml-4 mt-1 mb-3'}>Click to see pricing</div>
                  <div className="grid gap-3">
                    {pdpInfo.productDetails.flavorsOrSizes.map((variant, index) => {
                      const productDetails = groupProducts.find((p) => p.slug === variant.slug)
                      return (
                        <div key={variant.productId || index} className="collapse bg-base-200 rounded-lg p-4">
                          <input type="checkbox" />
                          <div className="collapse-title flex items-center justify-between">
                            <div>
                              <div className="font-medium">{variant.name}</div>
                              {variant.trialSize && <div className="badge badge-outline badge-xs mt-1">Trial Size</div>}
                            </div>
                            <div className="flex items-center gap-1 text-sm">
                              <StarRating rating={variant.reviews.average} />
                              <span className="text-xs text-base-content/60">
                                ({variant.reviews.count.toLocaleString()})
                              </span>
                            </div>
                          </div>
                          <div className="collapse-content">
                            {productDetails && <ProductPricingTable product={productDetails} />}
                            {!productDetails && (
                              <p className={'text-sm text-error'}>Warning! No product found in the commerce feed.</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <a href={page.previewUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline gap-2">
            <HiOutlineExternalLink className="h-5 w-5" />
            Preview Page
          </a>
          <a href={`/content/${page.id}`} target={'_blank'} rel="noopener noreferrer" className="btn btn-primary gap-2">
            <HiPencil className="h-5 w-5" />
            Edit in Builder
          </a>
        </div>
      </div>
    </div>
  )
}

export default PageDetailCard
