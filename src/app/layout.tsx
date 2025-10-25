// src/app/layout.tsx - Enhanced with better mobile support
import './globals.css'
import { Inter } from 'next/font/google'
import CartSidebar from './components/CartSidebar'
import { Providers } from './providers'
import NextTopLoader from 'nextjs-toploader'
import Header from './components/Header'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'LapStore - Premium Computers & Electronics',
    template: '%s | LapStore'
  },
  description: 'Your one-stop shop for computers, laptops, components, and accessories. Best prices on gaming laptops, business computers, and electronics.',
  keywords: 'computers, laptops, gaming, electronics, components, accessories, tech',
  authors: [{ name: 'LapStore' }],
  creator: 'LapStore',
  publisher: 'LapStore',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://lapstore.com'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lapstore.com',
    siteName: 'LapStore',
    title: 'LapStore - Premium Computers & Electronics',
    description: 'Your one-stop shop for computers, laptops, components, and accessories.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'LapStore - Premium Computers & Electronics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LapStore - Premium Computers & Electronics',
    description: 'Your one-stop shop for computers, laptops, components, and accessories.',
    images: ['/images/og-image.jpg'],
    creator: '@lapstore',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Providers>
          <NextTopLoader
            color="#2563eb"
            height={3}
            showSpinner={false}
          />
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            {/* Cart sidebar */}
            <CartSidebar />
          </div>
        </Providers>
      </body>
    </html>
  )
}