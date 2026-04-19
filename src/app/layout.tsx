import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Trakvex — Track Every Trade. Analyze Every Pattern.',
  description: 'A professional trading journal with real analytics — so you can understand your edge, eliminate mistakes, and grow with data instead of guesswork.',
  keywords: 'trading, forex, stocks, crypto, trading journal, performance analysis, trade tracking',
  metadataBase: new URL('https://trakvex.com'),
  openGraph: {
    title: 'Trakvex — Track Every Trade. Analyze Every Pattern.',
    description: 'A professional trading journal with real analytics — so you can understand your edge, eliminate mistakes, and grow with data instead of guesswork.',
    url: 'https://trakvex.com',
    siteName: 'Trakvex',
    images: [
      {
        url: 'https://trakvex.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Trakvex — Professional Trading Journal',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trakvex — Track Every Trade. Analyze Every Pattern.',
    description: 'A professional trading journal with real analytics — so you can understand your edge, eliminate mistakes, and grow with data instead of guesswork.',
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