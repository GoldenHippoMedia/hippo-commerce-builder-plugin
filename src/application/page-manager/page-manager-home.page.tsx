import React from "react";
import { AppTabState } from "@application/AppCore";
import StatGridContainer from "@components/stat-grid/stat-grid-container.component";
import StatGridCard from "@components/stat-grid/stat-grid-card.component";
import { useObserver } from "mobx-react";
import PageList from "@components/page-list.component";
import { AiOutlineReload } from "react-icons/ai";

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
    <div className={"w-full max-w-7xl mx-auto items-center"}>
      <StatGridContainer>
        <StatGridCard
          variant={"info"}
          title={"General"}
          subtitle={"general pages published"}
          metric={general().length}
          loading={state.loadingPages}
        ></StatGridCard>
        <StatGridCard
          variant={"info"}
          title={"PDP"}
          subtitle={"product detail pages published"}
          metric={products().length}
          loading={state.loadingPages}
        ></StatGridCard>
        <StatGridCard
          variant={"info"}
          title={"Blog"}
          subtitle={"blog pages published"}
          metric={blogs().length}
          loading={state.loadingPages}
        ></StatGridCard>
      </StatGridContainer>
      <div className={"w-fit ml-auto mr-4"}>
        <button
          className={"btn btn-secondary btn-sm mb-8"}
          onClick={state.loadPages}
        >
          <AiOutlineReload />
          Refresh
        </button>
      </div>
      <div className={"w-full"}>
        <PageList pages={state.pages} isLoading={state.loadingPages} products={state.products} />
      </div>
    </div>
  ));
}

export default PageManagerHomePage;
