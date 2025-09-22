import './styles.css';
import React from 'react';
import { ReactCookieProps } from 'react-cookie';
import { ExtendedApplicationContext } from '../interfaces/application-context.interface';
import { IBrandSettings, IProduct } from '@services/commerce-api/types';
import { BlogComment, PageDetails } from '@utils/utils.interfaces';
import { HippoUser } from '@services/user-management';
import { BuilderContentProduct } from '@components/products-dashboard.component';
interface AppCoreProps extends ReactCookieProps {
    context: ExtendedApplicationContext;
}
/**
 * Rudimentary routing system. The last page is stored as a cookie.
 * The values are capitalized and used in navigation and bread crumbs.
 *
 * Use `:` to indicate a child page.
 * Use `_` for spaces in the name.
 * Use `*` as a prefix of the child name to prevent displaying in the main navigation.
 * List pages in the order you want them to appear in the navigation menu.
 */
export declare enum PageOption {
    HOME = "home",
    PAGES = "pages",
    PRODUCTS = "products",
    BLOGS = "blogs",
    BLOG_COMMENTS = "blogs:*comments",
    SETTINGS = "settings",
    ABOUT = "about"
}
/**
 * Global "App" State.
 * Data loaded here should be required for the initial app usage or frequently shared
 * between components.
 */
export interface AppTabState {
    user: HippoUser;
    page: PageOption;
    setPage: (page?: PageOption) => void;
    loading: boolean;
    loadingBrandDetails: boolean;
    loadBrandDetails: () => void;
    brandDetails: IBrandSettings | undefined;
    loadingPages: boolean;
    loadPages: () => void;
    pages: PageDetails[];
    builderProducts: BuilderContentProduct[];
    loadingBuilderProducts: boolean;
    blogComments: BlogComment[];
    blogCommentsPendingModeration: BlogComment[];
    loadingBlogComments: boolean;
    loadProducts: () => void;
    products: IProduct[];
    loadingProducts: boolean;
    context: ExtendedApplicationContext;
    loadBuilderContent: () => void;
}
declare function AppCore(props: AppCoreProps): React.ReactElement;
export default AppCore;
