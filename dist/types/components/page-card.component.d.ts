import { PageDetails } from '@utils/utils.interfaces';
import React from 'react';
interface Props {
    page: PageDetails;
    onSelectPage?: (page: PageDetails) => void;
    onSelectPageLabel?: string;
}
declare function PageCard(props: Props): React.JSX.Element;
export default PageCard;
