// src/app/layout.tsx - Enhanced with better mobile support
import './globals.css'
import { Inter } from 'next/font/google'
import CartSidebar from './components/CartSidebar'
import { Providers } from './providers'
import NextTopLoader from 'nextjs-toploader'
import Header from './components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'LapStore - Your Computer Store',
  description: 'Your one-stop shop for computers, laptops, components, and accessories',
  viewport: 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes',
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