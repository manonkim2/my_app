import type { Metadata } from 'next'
import './globals.css'
import { Montserrat, Poppins } from 'next/font/google'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ReactQueryProvider from '@/components/ReactQueryProvider'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['200', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--montserrat-text',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--poppins-text',
})

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${montserrat.variable} ${poppins.variable}`}>
        <ReactQueryProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  )
}
