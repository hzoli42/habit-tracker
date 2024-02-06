'use client'
import Navbar from '@/components/utils/Navbar'
import './globals.css'
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
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
                {children}
              </body>
            </LocalizationProvider>
          </UserProvider>
        </Provider>
      </ThemeProvider>
    </html>
  )
}
