import React from "react";
import { CookiesProvider } from "react-cookie";
import { ExtendedApplicationContext } from "../interfaces/application-context.interface";
import "./styles.css";
import AppCore from "./AppCore";

interface AppProps {
  context: ExtendedApplicationContext;
}

const HippoCMSManager = React.memo((props: AppProps) => {
  const { context } = props;
  return (
    <React.StrictMode>
      <CookiesProvider>
        <AppCore context={context} />
      </CookiesProvider>
    </React.StrictMode>
  );
});

export default HippoCMSManager;
