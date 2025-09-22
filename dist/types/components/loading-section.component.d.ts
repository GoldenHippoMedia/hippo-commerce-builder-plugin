import React from 'react';
interface LoadingSectionProps {
    message?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default';
    loadingType?: 'dots' | 'spinner' | 'ball' | 'ring' | 'bars';
}
declare function LoadingSection({ message, color, size, loadingType }: LoadingSectionProps): React.JSX.Element;
export default LoadingSection;
