import React from 'react';
import { PageDetails } from '@utils/utils.interfaces';
import { IProduct } from '@services/commerce-api/types';
interface Props {
    page: PageDetails;
    onClose: () => void;
    products: IProduct[];
}
declare function PageDetailsDialog({ page, onClose, products }: Props): React.JSX.Element;
export default PageDetailsDialog;
