'use client'
import Navbar from '@/components/Navbar'
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Monomaniac+One&display=swap');
          </style>
        </head>
        <body>
          <Navbar />
          {children}
        </body>
    </html>
  )
}
