/** @jsx jsx */
import { jsx } from "@emotion/core";
import { useObserver } from "mobx-react";
import { Theme, withStyles, WithStyles } from "@material-ui/core";
import { createStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import { AddShoppingCart, Comment, Pages } from "@material-ui/icons";
import { Cookies } from "react-cookie";
import StatGridContainer from "@components/stat-grid/stat-grid-container.component";
import StatGridCard from "@components/stat-grid/stat-grid-card.component";
import { AppTabState, PageOption } from "@application/AppCore";

interface AppTabProps extends WithStyles<typeof styles> {
  state: AppTabState;
  cookies: Cookies;
}

const styles = (theme: Theme) =>
  createStyles({
    mainContainer: {
      marginRight: "auto",
      marginLeft: "auto",
      justifyContent: "center",
      maxWidth: 1440,
      paddingLeft: theme.spacing.unit * 2,
      paddingRight: theme.spacing.unit * 2,
    },
    statContainer: {
      maxWidth: 1440,
      marginLeft: "auto",
      marginRight: "auto",
      marginBottom: theme.spacing.unit * 2,
    },
    brandHeader: {
      background: "white",
      borderRadius: theme.spacing.unit * 2,
      justifyContent: "center",
      maxWidth: "fit-content",
      marginRight: "auto",
      marginLeft: "auto",
      marginBottom: theme.spacing.unit * 2,
      boxShadow: theme.shadows[1],
    },
    brandLogo: {
      maxWidth: theme.spacing.unit * 44,
      padding: theme.spacing.unit * 2,
      borderRadius: theme.spacing.unit * 2,
    },
    bottomNavigation: {
      position: "absolute",
      bottom: 0,
      width: "100%",
    },
  });


function HomePage(props: AppTabProps) {
  const { classes, state } = props;

  return useObserver(() => (
    <div className={'max-w-8xl mx-auto px-4 justify-center'}>
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
  ));
}

HomePage.propTypes = {
  classes: PropTypes.object.isRequired,
} as any;

export default withStyles(styles)(HomePage);
