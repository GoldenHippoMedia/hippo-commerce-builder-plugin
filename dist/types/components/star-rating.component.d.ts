import React from 'react';
type StarVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
interface Props {
    rating: number;
    variant?: StarVariant;
}
declare function StarRating(props: Props): React.JSX.Element;
export default StarRating;
