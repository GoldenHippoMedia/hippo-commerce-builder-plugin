import { BuilderContentProduct } from '@components/products-dashboard.component';
import React from 'react';
import { IProduct } from '@services/commerce-api/types';
interface ProductDetailsModalProps {
    product: BuilderContentProduct;
    commerceProduct?: IProduct;
    onClose: () => void;
    images: {
        src: string;
        alt: string;
        type: 'featured' | 'secondary';
    }[];
}
declare function ProductDetailsModal({ product, commerceProduct, onClose, images }: ProductDetailsModalProps): React.JSX.Element;
export default ProductDetailsModal;
