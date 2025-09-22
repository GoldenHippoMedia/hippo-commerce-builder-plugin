import React from 'react';
import { PageDetails } from '@utils/utils.interfaces';
import { IProduct } from '@services/commerce-api/types';
interface PageListProps {
    pages: PageDetails[];
    products: IProduct[];
    isLoading: boolean;
}
declare function PageList(props: PageListProps): React.JSX.Element;
export default PageList;
