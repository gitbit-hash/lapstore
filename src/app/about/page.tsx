import Header from '../components/Header'

export default function AboutPage() {
  return (
    <main>
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About LapStore</h1>

          <div className="prose prose-lg">
            <p className="text-gray-600 mb-6">
              Welcome to LapStore, your premier destination for cutting-edge technology and computer products.
              We are passionate about providing the latest and most reliable tech solutions for both personal and professional use.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              To make advanced technology accessible to everyone by offering high-quality products,
              competitive prices, and exceptional customer service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <ul className="text-gray-600 list-disc list-inside space-y-2 mb-6">
              <li>Wide selection of products from top brands</li>
              <li>Expert customer support and technical assistance</li>
              <li>Fast and reliable shipping</li>
              <li>Secure payment options</li>
              <li>30-day return policy</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-600">
              Have questions? Call us at <strong>(123) 456-7890</strong> or email <strong>support@techhaven.com</strong>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}