import { AppState, Auth0Provider } from "@auth0/auth0-react";
import { useRouter } from "next/navigation";
import React from "react";


// export const Auth0ProviderWithNavigate = ({ children }) => {
//   const navigate = useNavigate();

//   const domain = process.env.REACT_APP_AUTH0_DOMAIN;
//   const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
//   const redirectUri = process.env.REACT_APP_AUTH0_CALLBACK_URL;

//   const onRedirectCallback = (appState) => {
//     navigate(appState?.returnTo || window.location.pathname);
//   };

//   if (!(domain && clientId && redirectUri)) {
//     return null;
//   }

//   return (
//     <Auth0Provider
//       domain={domain}
//       clientId={clientId}
//       authorizationParams={{
//         redirect_uri: redirectUri,
//       }}
//       onRedirectCallback={onRedirectCallback}
//     >
//       {children}
//     </Auth0Provider>
//   );
// };

export default function Auth0ProviderWithNavigate({children}: {children: React.ReactNode}) {
  const router = useRouter()

  const domain = process.env.NEXT_PUBLIC_REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.NEXT_PUBLIC_REACT_APP_AUTH0_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_REACT_APP_AUTH0_CALLBACK_URL;

  function onRedirectCallback(appState: AppState | undefined) {
    console.log(`Redirecting to ${appState?.returnTo}`)
    router.push(appState?.returnTo || window.location.pathname)
  }

  if (domain && clientId && redirectUri) {
    console.log(`Found vars: ${domain}, ${clientId}, ${redirectUri}`)
  } else {
    console.log(`Did not find vars: ${domain}, ${clientId}, ${redirectUri}`)
  }

  return (
    <>
      {
        (domain && clientId && redirectUri)
        ? <Auth0Provider
          domain={domain}
          clientId={clientId}
          authorizationParams={{
            redirect_uri: redirectUri,
          }}
          onRedirectCallback={onRedirectCallback}>
          {children}
        </Auth0Provider>
        : null
      }
    </>
  )
}