import Navbar from '@/components/utils/Navbar'
import './globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

    <html lang="en">
      <UserProvider>
        <body>
          <Navbar />
          {children}
        </body>
      </UserProvider>
    </html>
  )
}
