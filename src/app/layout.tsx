// src/app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import CartSidebar from './components/CartSidebar'
import { Providers } from './providers'
import NextTopLoader from 'nextjs-toploader'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Computer Retail Store',
  description: 'Your one-stop shop for computers and accessories',
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
          <div className="min-h-screen bg-gray-50">
            {children}
            <CartSidebar />
          </div>
        </Providers>
      </body>
    </html>
  )
}