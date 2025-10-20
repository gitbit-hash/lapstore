// asrc/pp/checkout/cancel/page.tsx - Simple version
import Link from 'next/link'

export default function CheckoutCancel() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Checkout Cancelled</h1>
                <p className="text-gray-600 mb-8">
                    Your order was not completed. You can return to your cart to try again.
                </p>
                <Link
                    href="/cart"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                    Return to Cart
                </Link>
            </div>
        </div>
    )
}