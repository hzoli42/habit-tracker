'use client'
import Navbar from '@/components/utils/Navbar'
import './globals.css'
import Auth0ProviderWithNavigate from '@/components/utils/Auth0ProviderWithNavigate'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <body>
          <Auth0ProviderWithNavigate>
            <Navbar />
            {children}
          </Auth0ProviderWithNavigate>
        </body>
    </html>
  )
}
