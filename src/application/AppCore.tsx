import "./styles.css";
import React, { useEffect } from "react";
import { ReactCookieProps, useCookies } from "react-cookie";
import HomePage from "@application/home.page";
import { ExtendedApplicationContext } from "../interfaces/application-context.interface";
import { useLocalStore, useObserver } from "mobx-react";
import CommerceApi from "@services/commerce-api";
import BuilderApi from "@services/builder-api";
import { IBrandSettings, IProduct } from "@services/commerce-api/types";
import { BlogComment, PageDetails } from "@utils/utils.interfaces";
import ProductsHomePage from "@application/products/products-home.page";
import PageManagerHomePage from "@application/page-manager/page-manager-home.page";
import { AiFillMoon, AiFillSun, AiOutlineMenu } from "react-icons/ai";
import UserManagementService, { HippoUser } from "@services/user-management";
import LoadingSection from "@components/loading-section.component";
import { BuilderContentProduct } from "@components/products-dashboard.component";
import PageNotFound from "@components/page-not-found.component";
import BlogCommentPage from "@application/blog/comments/blog-comment.page";
import BlogHomePage from "@application/blog/blog-home.page";
import UserSettingsPage from "@application/settings/user-settings.page";

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
export enum PageOption {
  HOME = "home",
  PAGES = "pages",
  PRODUCTS = "products",
  BLOGS = "blogs",
  BLOG_COMMENTS = "blogs:*comments",
  SETTINGS = "settings",
  ABOUT = "about",
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

enum HippoCookies {
  PAGE = "gh-builder-page",
}

interface CookieValues {
  [HippoCookies.PAGE]: PageOption;
}

function pageFactory(page: PageOption, state: AppTabState): React.ReactElement {
  switch (page) {
    case PageOption.HOME:
      return <HomePage state={state} />;
    case PageOption.PAGES:
      return <PageManagerHomePage state={state} />;
    case PageOption.PRODUCTS:
      return <ProductsHomePage state={state} />;
    case PageOption.BLOGS:
      return <BlogHomePage state={state} />;
    case PageOption.BLOG_COMMENTS:
      return <BlogCommentPage state={state} />;
    case PageOption.SETTINGS:
      return <UserSettingsPage state={state} />;
    default:
      return <PageNotFound state={state} />;
  }
}

function AppCore(props: AppCoreProps): React.ReactElement {
  const { context } = props;
  const [cookies, setCookie] = useCookies<HippoCookies, CookieValues>([
    HippoCookies.PAGE,
  ]);
  const { user } = context;
  const hippoUser = UserManagementService.getUserDetails(context);
  const commerceApi = new CommerceApi(hippoUser);
  const builderApi = new BuilderApi(user.authHeaders, user.apiKey);
  const state: AppTabState = useLocalStore<AppTabState>(() => ({
    user: hippoUser,
    /** Context */
    context: context,
    /** Navigation */
    page: cookies[HippoCookies.PAGE] || "home",
    setPage: (page?: PageOption): void => {
      if (page) {
        setCookie(HippoCookies.PAGE, page);
        state.page = page;
      } else {
        const cookiePage = cookies[HippoCookies.PAGE];
        if (cookiePage && cookiePage !== "settings") {
          state.page = cookies[HippoCookies.PAGE];
        } else {
          setCookie(HippoCookies.PAGE, PageOption.HOME);
          state.page = PageOption.HOME;
        }
      }
    },

    /** Content */
    brandDetails: undefined,
    pages: [],
    builderProducts: [],
    blogComments: [],
    blogCommentsPendingModeration: [],
    products: [],

    /** Loading States */
    loadingBrandDetails: false,
    loadingPages: false,
    loadingBuilderProducts: false,
    loadingBlogComments: false,
    loadingProducts: false,
    get loading() {
      return state.loadingBrandDetails;
    },

    /** Loaders */
    async loadBrandDetails() {
      // @ts-ignore
      const test = await state.context.content.fetch(
        "a08f3b4fcff14c738764b8e0adba1593",
      );
      console.info("[HIPPO COMMERCE] CONTEXT", test);
      state.loadingBrandDetails = true;
      state.brandDetails = await commerceApi.getBrandSettings();
      state.loadingBrandDetails = false;
    },
    async loadPages() {
      state.loadingPages = true;
      state.pages = await builderApi.getPages(state.pages.length > 0);
      state.loadingPages = false;
    },
    async loadProducts() {
      state.loadingProducts = true;
      const products = await commerceApi.getProductFeed();
      console.info("[Hippo Commerce] products", products);
      state.products = products;
      state.loadingProducts = false;
    },

    async loadBuilderContent() {
      state.loadingPages = true;
      state.loadingBuilderProducts = true;
      state.loadingBlogComments = true;
      const [pages, builderProducts, blogComments] = await Promise.all([
        builderApi.getPages(state.pages.length > 0),
        builderApi.fetchContent({
          modelName: "product",
          limit: 30000,
          bustCache: state.builderProducts.length > 0,
        }),
        builderApi.getBlogComments(),
      ]);
      state.pages = Array.isArray(pages) ? pages : [];
      state.loadingPages = false;
      console.info("[Hippo Commerce] products", builderProducts);
      state.builderProducts = Array.isArray(builderProducts)
        ? (builderProducts as BuilderContentProduct[])
        : [];
      state.loadingBuilderProducts = false;
      state.blogComments = Array.isArray(blogComments) ? blogComments : [];
      state.loadingBlogComments = false;
    },
  }));

  useEffect(() => {
    refreshData().then(() => {
      console.info("[Hippo Commerce] App Core Refresh");
    });
  }, []);

  const refreshData = async () => {
    state.setPage();
    state.loadBrandDetails();
    state.loadProducts();
    state.loadBuilderContent();
  };

  const handleMenuClick = (page: PageOption): void => {
    // const element = document.activeElement;
    // if (element && element instanceof HTMLElement) element.blur();
    state.setPage(page);
  };

  const breadCrumbs = () => {
    const pages = state.page.split(":") as string[];
    if (pages && pages.length > 0 && pages[0].toLowerCase() !== "home") {
      return (
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a onClick={() => state.setPage(PageOption.HOME)}>Home</a>
            </li>
            {pages.map((page, index) => {
              const path = pages.slice(0, index + 1).join(":");
              const disabled = state.page.toLowerCase() === path.toLowerCase();
              if (disabled) {
                return (
                  <li key={page} className={"capitalize"}>
                    {page.toLowerCase()}
                  </li>
                );
              }
              return (
                <li
                  key={page}
                  onClick={() => state.setPage(PageOption.HOME)}
                  className={"capitalize"}
                >
                  {page.toLowerCase()}
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
    return (
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <a>Home</a>
          </li>
        </ul>
      </div>
    );
  };

  return useObserver(() => (
    <div
      id={"hippo-app"}
      className={"w-full px-4"}
      data-theme={context.config.darkMode ? "night" : "bumblebee"}
    >
      <div
        id={"hippo-app-frame"}
        className={`w-full bg-base-100 max-w-full mx-auto min-h-screen rounded-2xl shadow-2xl shadow-accent`}
      >
        <div className="navbar mt-2 mb-6 shadow-sm">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <AiOutlineMenu />
              </div>
              <ul
                tabIndex={0}
                className="menu menu-md dropdown-content rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                {Object.keys(PageOption).map((option) => {
                  const value = PageOption[option as keyof typeof PageOption];
                  const pages = value.split(":");
                  const page = pages[pages.length - 1];
                  // Replace _ with spaces
                  const label = page.replace(/_/g, " ");
                  if (label.startsWith("*")) {
                    return undefined;
                  }
                  return (
                    <li key={option}>
                      <a
                        className={`capitalize`}
                        onClick={() =>
                          state.setPage(
                            PageOption[option as keyof typeof PageOption],
                          )
                        }
                      >
                        {label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="navbar-center">
            <a
              className="btn btn-ghost px-6 py-8 hover:bg-default"
              onClick={() => state.setPage(PageOption.HOME)}
            >
              {state.brandDetails && (
                <div
                  className={
                    "align-center text-center w-fit mx-auto justify-content-center align-items-center"
                  }
                >
                  <div className={"card-title text-primary"}>
                    {state.brandDetails.name}
                  </div>
                  <div className={"text-muted text-xs text-center ml-12"}>
                    Site Management
                  </div>
                </div>
              )}
            </a>
          </div>
          <div className="navbar-end">
            <button
              className="btn btn-ghost btn-circle"
              onClick={() => {
                context.config.darkMode = !context.config.darkMode;
              }}
            >
              {context.config.darkMode ? <AiFillSun /> : <AiFillMoon />}
            </button>
          </div>
        </div>
        <main className={"flex-grow min-h-[95svh] w-full mx-auto px-2"}>
          {!state.loading && state.brandDetails && (
            <div className={"max-w-8xl mx-auto"}>
              <div>{breadCrumbs()}</div>
              {pageFactory(state.page, state)}
            </div>
          )}
          {state.loading && (
            <LoadingSection size={"lg"} message={"Initializing..."} />
          )}
        </main>
        <footer className="footer mt-12 sm:footer-horizontal flex-grow footer-center bg-base-300 text-base-content p-4">
          <aside>
            <p className={"italic"}>Powered by Hippo Commerce</p>
            <p>Copyright © {new Date().getFullYear()} - Golden Hippo</p>
          </aside>
        </footer>
      </div>
    </div>
  ));
}

export default AppCore;
