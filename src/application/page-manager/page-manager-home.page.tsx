import React from "react";
import { AppTabState } from "@application/AppCore";
import StatGridContainer from "@components/stat-grid/stat-grid-container.component";
import StatGridCard from "@components/stat-grid/stat-grid-card.component";
import { useObserver } from "mobx-react";
import PageList from "@components/page-list.component";
import { AiOutlineReload } from "react-icons/ai";
import { HiOutlineDocumentText } from "react-icons/hi2";

interface Props {
  state: AppTabState;
}

function PageManagerHomePage(props: Props) {
  const { state } = props;

  const blogs = () => {
    return state.pages.filter((page) => page.pageType === "Blog");
  };

  const products = () => {
    return state.pages.filter((page) => page.pageType === "Product");
  };

  const general = () => {
    return state.pages.filter((page) => page.pageType === "General");
  };

  return useObserver(() => (
    <div className="bg-base-100 min-h-screen rounded-lg max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-base-200 p-6 border-b border-base-300 rounded-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <HiOutlineDocumentText className="h-8 w-8" />
              {state.brandDetails?.name} Pages
            </h1>
            <div className="text-sm text-base-content/60">
              {state.pages.length} total pages
            </div>
          </div>

          {/* Stats Grid */}
          <div className="mb-6">
            <StatGridContainer>
              <StatGridCard
                variant={"info"}
                title={"General"}
                subtitle={"general pages published"}
                metric={general().length}
                loading={state.loadingPages}
              />
              <StatGridCard
                variant={"info"}
                title={"PDP"}
                subtitle={"product detail pages published"}
                metric={products().length}
                loading={state.loadingPages}
              />
              <StatGridCard
                variant={"info"}
                title={"Blog"}
                subtitle={"blog pages published"}
                metric={blogs().length}
                loading={state.loadingPages}
              />
            </StatGridContainer>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm text-base-content/70">
                Manage and audit your website pages
              </div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={state.loadPages}
            >
              <AiOutlineReload />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Page List */}
      <div className="max-w-7xl mx-auto p-6">
        <PageList pages={state.pages} isLoading={state.loadingPages} products={state.products} />
      </div>
    </div>
  ));
}

export default PageManagerHomePage;
