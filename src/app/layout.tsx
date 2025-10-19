// app/layout.tsx - Updated to include cart
import './globals.css'
import { Inter } from 'next/font/google'
import CartSidebar from './components/CartSidebar'
import StoreInitializer from './components/StoreInitializer'


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
        <StoreInitializer />
        {children}
        <CartSidebar />
      </body>
    </html>
  )
}