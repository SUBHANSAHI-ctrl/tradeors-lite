import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'TraderOS - Qovavo',
  description: 'Professional trading journal and analytics platform',
  keywords: 'trading, forex, stocks, crypto, trading journal, performance analysis, trade tracking',
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