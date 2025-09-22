import React from 'react';
type StatCardVariant = 'success' | 'warning' | 'error' | 'neutral' | 'info';
export interface StatGridCardProps {
    title: string;
    metric: string | number;
    loading?: boolean;
    currency?: boolean;
    actionLabel?: string;
    onActionClick?: () => void;
    variant?: StatCardVariant;
    subtitle?: string;
    icon?: React.ReactNode;
    className?: string;
}
declare function StatGridCard(props: StatGridCardProps): React.ReactElement;
export default StatGridCard;
