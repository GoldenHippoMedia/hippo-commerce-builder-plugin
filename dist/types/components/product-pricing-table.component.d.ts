import React from 'react';
import { IProduct } from '@services/commerce-api/types';
interface PricingTableProps {
    product: IProduct;
    className?: string;
}
declare const ProductPricingTable: React.FC<PricingTableProps>;
export default ProductPricingTable;
