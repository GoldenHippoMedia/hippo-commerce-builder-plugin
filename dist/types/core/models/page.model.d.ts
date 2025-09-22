import { ModelShape } from '../HippoModels';
export interface PageModelFactoryProps {
    productModelId: string;
    productGroupModelId: string;
    categoryModelId: string;
    bannerModelId: string;
    blogCategoryModelId: string;
    editUrl: string;
}
export declare enum PageTypes {
    GENERAL = "General",
    PRODUCT = "Product",
    BLOG = "Blog"
}
export declare enum PdpTypes {
    PRODUCT = "Product",
    PRODUCT_GROUP = "Product Group"
}
export declare enum OfferSelectorTypes {
    VERTICAL = "Vertical",
    VERTICAL__FLAVOR_DROPDOWN__TYPE_TOGGLE = "Vertical - Flavor Dropdown - Type Toggle",
    STACKED__FLAVOR_BUTTONS__QUANTITY_TOGGLE = "Stacked - Flavor Buttons - Quantity Toggle"
}
export declare enum OfferSelectorSliderTypes {
    SLIDER_A = "Slider A",
    SLIDER_B = "Slider B"
}
export declare enum OfferSelectorDefaultPurchaseType {
    ONE_TIME = "One-Time Purchase",
    SUBSCRIPTION = "Subscription"
}
export declare enum OfferSelectorSavingsType {
    PERCENT = "percentage",
    DOLLAR = "dollar"
}
export declare const pageModelFactory: (props: PageModelFactoryProps) => ModelShape;
