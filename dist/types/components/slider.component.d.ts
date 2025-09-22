import React from 'react';
export interface SlideItem {
    url: string;
    altText: string;
}
interface SliderProps {
    items: SlideItem[];
    className?: string;
    imageClassName?: string;
    showDots?: boolean;
    showArrows?: boolean;
    autoPlay?: boolean;
    autoPlayInterval?: number;
    onSlideChange?: (currentIndex: number) => void;
}
declare const Slider: React.FC<SliderProps>;
export default Slider;
