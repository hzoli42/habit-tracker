import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/layout";
import { Auth0Provider } from "@auth0/auth0-react";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Auth0Provider
      domain="dev-53rbxqyn0edsff4y.uk.auth0.com"
      clientId="nWTpy7fJn6HtTTncbMhuGNcDst64j4Pn"
      authorizationParams={{
        redirect_uri: 'http://localhost:3000'
      }}
      useRefreshTokens
      cacheLocation='localstorage'
    >
      <Layout>
        <Component {...pageProps} />;
      </Layout>
    </Auth0Provider>
  );
}

export default MyApp;
