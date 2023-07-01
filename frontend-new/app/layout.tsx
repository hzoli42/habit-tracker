'use client'
import Navbar from '@/components/Navbar'
import './globals.css'
import { Auth0Provider } from '@auth0/auth0-react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Auth0Provider
          domain="dev-53rbxqyn0edsff4y.uk.auth0.com"
          clientId="nWTpy7fJn6HtTTncbMhuGNcDst64j4Pn"
          authorizationParams={{
            redirect_uri: 'http://localhost:3000'
          }}
          useRefreshTokens
          cacheLocation='localstorage'
      >
        <body>
          <Navbar />
          {children}
        </body>
      </Auth0Provider>
    </html>
  )
}
