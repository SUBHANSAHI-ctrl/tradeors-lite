import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Trakvex — Trading Journal & Analytics | Part of Qovavo',
  description: 'Trakvex is a professional trading journal with real analytics. Track every trade, measure your true win rate, and fix the habits costing you money. Free to start.',
  keywords: 'trading journal, trading analytics, forex journal, crypto trading log, trade tracker, win rate calculator, profit factor, trading performance, behavioral edge, retail trader, Trakvex, Qovavo',
  metadataBase: new URL('https://trakvex.com'),
  openGraph: {
    title: 'Trakvex — Trading Journal & Analytics | Part of Qovavo',
    description: 'Trakvex is a professional trading journal with real analytics. Track every trade, measure your true win rate, and fix the habits costing you money. Free to start.',
    url: 'https://trakvex.com',
    siteName: 'Trakvex',
    images: [
      {
        url: 'https://trakvex.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Trakvex — Professional Trading Journal & Analytics',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trakvex — Trading Journal & Analytics | Part of Qovavo',
    description: 'Trakvex is a professional trading journal with real analytics. Track every trade, measure your true win rate, and fix the habits costing you money. Free to start.',
    images: ['https://trakvex.com/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/logo/favicon.ico' },
      { url: '/logo/favicon.svg', type: 'image/svg+xml' }
    ],
    apple: [
      { url: '/logo/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  },
  manifest: '/logo/site.webmanifest'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}