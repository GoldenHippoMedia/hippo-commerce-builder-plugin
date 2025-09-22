import React from 'react';
import { IProduct } from '@services/commerce-api/types';
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
declare const ProductDashboard: React.FC<ProductDashboardProps>;
export default ProductDashboard;
