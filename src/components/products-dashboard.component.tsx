import React, { useMemo, useState } from "react";
import {
  HiChevronDown,
  HiChevronUp,
  HiOutlineCheckCircle,
  HiOutlineClipboardDocumentList,
  HiOutlineExclamationTriangle,
  HiOutlineEye,
  HiOutlineGlobeAlt,
  HiOutlineInformationCircle,
  HiOutlineMagnifyingGlass,
  HiOutlinePhoto,
  HiOutlineShoppingBag,
  HiOutlineStar,
} from "react-icons/hi2";
import LoadingSection from "@components/loading-section.component";
import ProductDetailsModal from "@components/product-details-modal.component";
import { IProduct } from "@services/commerce-api/types";

interface ProductReviews {
  id: string;
  count: number;
  averageRating: number;
}

interface ProductCategory {
  category: {
    id: string;
    value: {
      data: {
        name: string;
        slug: string;
      };
    };
  };
}

interface ProductTag {
  tag: {
    value: {
      data: {
        name: string;
        tagColor?: string;
        pluralDisplayName?: string;
      };
    };
  };
}

interface ProductUseCase {
  useCase: {
    value: {
      data: {
        name: string;
        description?: string;
      };
    };
  };
}

interface ProductIngredient {
  ingredient: {
    value: {
      data: {
        name: string;
      };
    };
  };
}

interface ProductData {
  id: string;
  name: string;
  displayName?: string;
  shortDescription?: string;
  subHeading?: string;
  hidden: boolean;
  outOfStock: boolean;
  upc?: string;
  featuredImage?: string;
  secondaryImage?: string;
  reviews?: ProductReviews;
  categories?: ProductCategory[];
  packagingLabels?: {
    singular: string;
    plural: string;
  };
  gh?: {
    slug: string;
    productionId: string;
    type: string;
  };
  tags?: ProductTag[];
  useCases?: ProductUseCase[];
  ingredients?: ProductIngredient[];
  quote?: string;
  altText?: string;
  title?: string;
}

export interface BuilderContentProduct {
  id: string;
  name: string;
  data: ProductData;
}

interface ProductDashboardProps {
  products: BuilderContentProduct[];
  hippoProducts: IProduct[];
  loading: boolean;
  className?: string;
}

type SortField = "name" | "reviews" | "stock";
type SortOrder = "asc" | "desc";
type FilterStatus = "all" | "visible" | "hidden" | "outOfStock" | "inStock";

const ProductDashboard: React.FC<ProductDashboardProps> = ({
  products,
  hippoProducts,
  loading,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("visible");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [detailsModalProduct, setDetailsModalProduct] =
    useState<BuilderContentProduct | null>(null);

  // Extract unique categories from products
  const availableCategories = useMemo(() => {
    const categoryMap = new Map<string, string>();

    if (!products || !Array.isArray(products)) {
      return [];
    }

    products.forEach((product) => {
      if (product?.data?.categories && Array.isArray(product.data.categories)) {
        product.data.categories.forEach((cat) => {
          if (cat?.category?.value?.data?.name) {
            const categoryData = cat.category.value.data;
            categoryMap.set(categoryData.name, categoryData.name);
          }
        });
      }
    });

    return Array.from(categoryMap.values()).sort();
  }, [products]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) {
      return [];
    }

    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product?.data?.name?.toLowerCase().includes(term) ||
          product?.data?.displayName?.toLowerCase().includes(term) ||
          product?.data?.shortDescription?.toLowerCase().includes(term) ||
          product?.data?.upc?.toLowerCase().includes(term),
      );
    }

    // Apply status filter
    if (filterStatus !== "all") {
      filtered = filtered.filter((product) => {
        if (!product?.data) return false;

        switch (filterStatus) {
          case "visible":
            return !product.data.hidden;
          case "hidden":
            return product.data.hidden;
          case "outOfStock":
            return product.data.outOfStock;
          case "inStock":
            return !product.data.outOfStock;
          default:
            return true;
        }
      });
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) =>
        product?.data?.categories?.some(
          (cat) => cat?.category?.value?.data?.name === selectedCategory,
        ),
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      if (!a?.data || !b?.data) return 0;

      let comparison = 0;

      switch (sortField) {
        case "name":
          comparison = (a.data.name || "").localeCompare(b.data.name || "");
          break;
        case "reviews":
          const aReviews = a.data.reviews?.averageRating || 0;
          const bReviews = b.data.reviews?.averageRating || 0;
          comparison = aReviews - bReviews;
          break;
        case "stock":
          comparison = Number(a.data.outOfStock) - Number(b.data.outOfStock);
          break;
        default:
          return 0;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [
    products,
    searchTerm,
    sortField,
    sortOrder,
    filterStatus,
    selectedCategory,
  ]);

  const getStatusCounts = () => {
    if (!products || !Array.isArray(products)) {
      return {
        all: 0,
        visible: 0,
        hidden: 0,
        outOfStock: 0,
        inStock: 0,
      };
    }

    return {
      all: products.length,
      visible: products.filter((p) => p?.data && !p.data.hidden).length,
      hidden: products.filter((p) => p?.data && p.data.hidden).length,
      outOfStock: products.filter((p) => p?.data && p.data.outOfStock).length,
      inStock: products.filter((p) => p?.data && !p.data.outOfStock).length,
    };
  };
  const getHippoProduct = (productSlug: string) => {
    return hippoProducts.find((product) => product.slug === productSlug);
  }

  const statusCounts = getStatusCounts();

  const getRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <HiOutlineStar
            key={i}
            className="h-4 w-4 text-yellow-500 fill-current"
          />,
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <HiOutlineStar
            key={i}
            className="h-4 w-4 text-yellow-500 fill-current opacity-50"
          />,
        );
      } else {
        stars.push(
          <HiOutlineStar key={i} className="h-4 w-4 text-base-content/20" />,
        );
      }
    }

    return <div className="flex items-center gap-1">{stars}</div>;
  };

  const toggleProductExpanded = (productId: string) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Helper function to get product images
  const getProductImages = (
    product: BuilderContentProduct,
  ): { src: string; alt: string; type: "featured" | "secondary" }[] => {
    const images = [];
    if (product.data.featuredImage) {
      images.push({
        src: product.data.featuredImage,
        alt: `${product.data.name} - Featured`,
        type: "featured",
      });
    }
    if (product.data.secondaryImage) {
      images.push({
        src: product.data.secondaryImage,
        alt: `${product.data.name} - Secondary`,
        type: "secondary",
      });
    }
    return images as {
      src: string;
      alt: string;
      type: "featured" | "secondary";
    }[];
  };

  // Reset image index when modal opens
  const openDetailsModal = (product: BuilderContentProduct) => {
    setDetailsModalProduct(product);
  };

  const onCloseModal = () => setDetailsModalProduct(null);

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
              <label className="text-sm font-medium text-base-content/80 mb-1 block">
                Category
              </label>
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
              <label className="text-sm font-medium text-base-content/80 mb-1 block">
                Status
              </label>
              <div className="tabs tabs-box tabs-sm">
                <button
                  className={`tab ${filterStatus === "all" ? "tab-active" : ""}`}
                  onClick={() => setFilterStatus("all")}
                >
                  All ({statusCounts.all})
                </button>
                <button
                  className={`tab ${filterStatus === "visible" ? "tab-active" : ""}`}
                  onClick={() => setFilterStatus("visible")}
                >
                  Visible ({statusCounts.visible})
                </button>
                <button
                  className={`tab ${filterStatus === "hidden" ? "tab-active" : ""}`}
                  onClick={() => setFilterStatus("hidden")}
                >
                  Hidden ({statusCounts.hidden})
                </button>
                <button
                  className={`tab ${filterStatus === "inStock" ? "tab-active" : ""}`}
                  onClick={() => setFilterStatus("inStock")}
                >
                  In Stock ({statusCounts.inStock})
                </button>
                <button
                  className={`tab ${filterStatus === "outOfStock" ? "tab-active" : ""}`}
                  onClick={() => setFilterStatus("outOfStock")}
                >
                  Out of Stock ({statusCounts.outOfStock})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr>
              <th className="w-12"></th>
              <th>
                <button
                  onClick={() => handleSort("name")}
                  className="flex items-center gap-1 hover:text-primary"
                >
                  Product
                  {sortField === "name" &&
                    (sortOrder === "asc" ? (
                      <HiChevronUp className="h-4 w-4" />
                    ) : (
                      <HiChevronDown className="h-4 w-4" />
                    ))}
                </button>
              </th>
              <th>Status</th>
              <th>
                <button
                  onClick={() => handleSort("reviews")}
                  className="flex items-center gap-1 hover:text-primary"
                >
                  Reviews
                  {sortField === "reviews" &&
                    (sortOrder === "asc" ? (
                      <HiChevronUp className="h-4 w-4" />
                    ) : (
                      <HiChevronDown className="h-4 w-4" />
                    ))}
                </button>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedProducts &&
              filteredAndSortedProducts.length > 0 &&
              filteredAndSortedProducts.map((product) => {
                if (!product?.data) return null;

                const isExpanded = expandedProduct === product.id;

                return (
                  <React.Fragment key={product.id}>
                    <tr
                      className={`hover ${product.data.hidden ? "opacity-60" : ""}`}
                    >
                      <td>
                        <button
                          onClick={() => toggleProductExpanded(product.id)}
                          className="btn btn-ghost btn-xs"
                        >
                          {isExpanded ? (
                            <HiChevronUp className="h-4 w-4" />
                          ) : (
                            <HiChevronDown className="h-4 w-4" />
                          )}
                        </button>
                      </td>

                      <td>
                        <div className="flex items-center gap-3">
                          {product.data.featuredImage && (
                            <div className="avatar">
                              <div className="w-12 h-12 rounded">
                                <img
                                  src={product.data.featuredImage}
                                  alt={product.data.name || "Product"}
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          )}
                          <div>
                            <div className="font-bold">
                              {product.data.displayName ? (
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: product.data.displayName,
                                  }}
                                />
                              ) : (
                                <span>
                                  {product.data.name || "Unnamed Product"}
                                </span>
                              )}
                            </div>
                            {product.data.shortDescription && (
                              <div className="text-sm text-base-content/60 max-w-xs truncate">
                                {product.data.shortDescription}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            {product.data.hidden ? (
                              <div className="badge badge-error badge-sm gap-1">
                                <HiOutlineEye className="h-3 w-3" />
                                Hidden
                              </div>
                            ) : (
                              <div className="badge badge-success badge-sm gap-1">
                                <HiOutlineCheckCircle className="h-3 w-3" />
                                Visible
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {product.data.outOfStock ? (
                              <div className="badge badge-warning badge-sm gap-1">
                                <HiOutlineExclamationTriangle className="h-3 w-3" />
                                Out of Stock
                              </div>
                            ) : (
                              <div className="badge badge-info badge-sm gap-1">
                                <HiOutlineCheckCircle className="h-3 w-3" />
                                In Stock
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td>
                        {product.data.reviews &&
                        product.data.reviews.count > 0 ? (
                          <div className="space-y-1">
                            {getRatingStars(product.data.reviews.averageRating)}
                            <div className="text-xs text-base-content/60">
                              {product.data.reviews.averageRating.toFixed(1)} (
                              {product.data.reviews.count.toLocaleString()}{" "}
                              reviews)
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-base-content/40">
                            No reviews
                          </div>
                        )}
                      </td>

                      <td>
                        <button
                          onClick={() => openDetailsModal(product)}
                          className="btn btn-ghost btn-sm gap-1"
                          title="View Details"
                        >
                          <HiOutlineInformationCircle className="h-4 w-4" />
                          Details
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Row */}
                    {isExpanded && (
                      <tr className="bg-base-50">
                        <td></td>
                        <td colSpan={5}>
                          <div className="p-4 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {/* Product Details */}
                              <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-1">
                                  <HiOutlineClipboardDocumentList className="h-4 w-4" />
                                  Product Details
                                </h4>
                                <div className="space-y-1 text-sm">
                                  <div>
                                    <span className="font-medium">
                                      Internal ID:
                                    </span>{" "}
                                    {product.id}
                                  </div>
                                  {product.data.upc && (
                                    <div>
                                      <span className="font-medium">UPC:</span>{" "}
                                      {product.data.upc}
                                    </div>
                                  )}
                                  {product.data.packagingLabels && (
                                    <div>
                                      <span className="font-medium">
                                        Packaging:
                                      </span>{" "}
                                      {product.data.packagingLabels.singular} /{" "}
                                      {product.data.packagingLabels.plural}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Images */}
                              <div className="space-y-2">
                                <h4 className="font-semibold flex items-center gap-1">
                                  <HiOutlinePhoto className="h-4 w-4" />
                                  Images
                                </h4>
                                <div className="flex gap-2">
                                  {product.data.featuredImage && (
                                    <div className="w-16 h-16 rounded border">
                                      <img
                                        src={product.data.featuredImage}
                                        alt="Featured"
                                        className="w-full h-full object-cover rounded"
                                      />
                                    </div>
                                  )}
                                  {product.data.secondaryImage && (
                                    <div className="w-16 h-16 rounded border">
                                      <img
                                        src={product.data.secondaryImage}
                                        alt="Secondary"
                                        className="w-full h-full object-cover rounded"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* External Links */}
                              {product.data.gh && (
                                <div className="space-y-2">
                                  <h4 className="font-semibold flex items-center gap-1">
                                    <HiOutlineGlobeAlt className="h-4 w-4" />
                                    External References
                                  </h4>
                                  <div className="space-y-1 text-sm">
                                    <div>
                                      <span className="font-medium">Slug:</span>{" "}
                                      {product.data.gh.slug}
                                    </div>
                                    <div>
                                      <span className="font-medium">
                                        Production ID:
                                      </span>{" "}
                                      {product.data.gh.productionId}
                                    </div>
                                    <div>
                                      <span className="font-medium">Type:</span>{" "}
                                      {product.data.gh.type}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Full Description */}
                            {product.data.shortDescription && (
                              <div>
                                <h4 className="font-semibold mb-2">
                                  Full Description
                                </h4>
                                <p className="text-sm text-base-content/80">
                                  {product.data.shortDescription}
                                </p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredAndSortedProducts.length === 0 && (
        <div>
          {loading && (
            <div className="text-center py-12">
              <HiOutlineShoppingBag className="h-12 w-12 text-base-content/30 mx-auto mb-4" />
              <LoadingSection size={"sm"} />
              <p className="text-sm text-base-content/50">
                Loading Products...
              </p>
            </div>
          )}
          {!loading && (
            <div className="text-center py-12">
              <HiOutlineShoppingBag className="h-12 w-12 text-base-content/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-base-content/60 mb-2">
                No Products Found
              </h3>
              <p className="text-sm text-base-content/50">
                {searchTerm ||
                filterStatus !== "all" ||
                selectedCategory !== "all"
                  ? "No products match the current filters. Try adjusting your search criteria."
                  : "No products available to display."}
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
  );
};

export default ProductDashboard;
