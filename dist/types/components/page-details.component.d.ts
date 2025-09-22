import { PageDetails } from '@utils/utils.interfaces';
import React from 'react';
import { IProduct } from '@services/commerce-api/types';
interface Props {
    page: PageDetails;
    onClose: () => void;
    products: IProduct[];
}
declare function PageDetailCard(props: Props): React.JSX.Element;
export default PageDetailCard;
