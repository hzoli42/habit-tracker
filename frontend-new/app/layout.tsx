'use client'
import './globals.css';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Provider } from 'jotai';
import { ThemeProvider } from "@material-tailwind/react";
import AppNavbar from '@/components/utils/Navbar';



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

    <html lang="en">
      <ThemeProvider>
        <Provider>
          <UserProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <body>
                <AppNavbar />
                <div className="mx-auto max-w-screen-lg pt-8 px-4">
                  {children}
                </div>
              </body>
            </LocalizationProvider>
          </UserProvider>
        </Provider>
      </ThemeProvider>
    </html>
  )
}
