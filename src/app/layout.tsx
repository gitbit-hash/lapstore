// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import CartSidebar from './components/CartSidebar'
import { Providers } from './providers'
import NextTopLoader from 'nextjs-toploader'
import Header from './components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TechHaven - Your Computer Store',
  description: 'Your one-stop shop for computers, laptops, components, and accessories',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <NextTopLoader
            color="#2563eb"
            height={3}
            showSpinner={false}
          />
          <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header is now global and appears on all pages */}
            <Header />

            {/* Main content area */}
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