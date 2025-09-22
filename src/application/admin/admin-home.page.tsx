import React from "react";
import PropTypes from "prop-types";
import { createStyles, withStyles, WithStyles } from "@material-ui/core/styles";
import { AppTabState } from "@application/AppCore";
import { Grid } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import UserManagementService from "@services/user-management";

const styles = createStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  userSettings: {
    display: "flex",
  },
});

interface Props extends WithStyles<typeof styles> {
  state: AppTabState;
}

function AdminHomePage(props: Props) {
  const { classes, state } = props;

  const triggerSettingsDialog = () => {
    state.context.config.darkMode = !state.context.config.darkMode;
    // @ts-expect-error incomplete types
    console.log(state.context.Builder);
  };

  return (
    <div className={classes.root}>
      <Typography variant={"h2"}>Admin Page</Typography>
      <Grid container={true} className={classes.userSettings}>
        <Grid item={true} xs={12}>
          <Typography variant={"h4"}>User Settings</Typography>
        </Grid>
        <Grid item={true} xs={12}>
          Is Admin: {state.context.user.can('admin') && (
          <div>Yes</div>
        )}
          <div>
            {JSON.stringify(state.user, null, 2)}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

AdminHomePage.propTypes = {
  classes: PropTypes.object.isRequired,
} as any;

export default withStyles(styles)(AdminHomePage);
