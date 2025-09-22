import React from 'react'
import { useObserver } from "mobx-react";
import { AddShoppingCart, Comment, Pages } from "@material-ui/icons";
import StatGridContainer from "@components/stat-grid/stat-grid-container.component";
import StatGridCard from "@components/stat-grid/stat-grid-card.component";
import { AppTabState, PageOption } from "@application/AppCore";

interface AppTabProps {
  state: AppTabState;
}

function HomePage(props: AppTabProps) {
  const { state } = props;

  return useObserver(() => (
    <div className="bg-base-100 min-h-screen rounded-lg max-w-7xl mx-auto">
      <div className="p-6">
        <StatGridContainer>
          <StatGridCard
            title={"Pages"}
            metric={state.pages.length}
            loading={state.loadingPages}
            variant={"info"}
            actionLabel={"Manage Pages"}
            subtitle={"pages published"}
            onActionClick={() => state.setPage(PageOption.PAGES)}
            icon={<Pages />}
          />
          <StatGridCard
            title={"Products"}
            metric={state.builderProducts.length}
            loading={state.loadingBuilderProducts}
            variant={"info"}
            actionLabel={"Manage Products"}
            subtitle={"products available sitewide"}
            onActionClick={() => state.setPage(PageOption.PRODUCTS)}
            icon={<AddShoppingCart />}
          />
          <StatGridCard
            title={"Blog Comments"}
            metric={state.blogCommentsPendingModeration.length}
            loading={state.loadingBlogComments}
            variant={
              state.blogCommentsPendingModeration.length > 0
                ? "error"
                : "neutral"
            }
            actionLabel={"Moderate Comments"}
            subtitle={"comments pending moderation"}
            onActionClick={() => state.setPage(PageOption.BLOG_COMMENTS)}
            icon={<Comment />}
          />
        </StatGridContainer>
      </div>
    </div>
  ));
}

export default HomePage
