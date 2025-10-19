// app/stores/cartStore.ts - Update to export CartItem
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartProduct } from '../types'

// Export the CartItem interface
export interface CartItem extends CartProduct {
    quantity: number
}

interface CartState {
    items: CartItem[]
    isOpen: boolean
    // Actions
    addItem: (product: CartProduct, quantity?: number) => void
    removeItem: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    toggleCart: () => void
    openCart: () => void
    closeCart: () => void
    // Getters
    getTotalPrice: () => number
    getTotalItems: () => number
    getItemCount: (productId: string) => number
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            // ... rest of the implementation remains the same
            items: [],
            isOpen: false,
            addItem: (product: CartProduct, quantity: number = 1) => {
                const { items } = get()
                const existingItem = items.find(item => item.id === product.id)

                if (existingItem) {
                    set({
                        items: items.map(item =>
                            item.id === product.id
                                ? { ...item, quantity: Math.min(item.quantity + quantity, product.inventory) }
                                : item
                        )
                    })
                } else {
                    set({
                        items: [...items, { ...product, quantity: Math.min(quantity, product.inventory) }]
                    })
                }
                get().openCart()
            },
            removeItem: (productId: string) => {
                const { items } = get()
                set({
                    items: items.filter(item => item.id !== productId)
                })
            },
            updateQuantity: (productId: string, quantity: number) => {
                const { items } = get()

                if (quantity <= 0) {
                    get().removeItem(productId)
                    return
                }

                set({
                    items: items.map(item =>
                        item.id === productId
                            ? { ...item, quantity: Math.min(quantity, item.inventory) }
                            : item
                    )
                })
            },
            clearCart: () => {
                set({ items: [] })
            },
            toggleCart: () => {
                set(state => ({ isOpen: !state.isOpen }))
            },
            openCart: () => {
                set({ isOpen: true })
            },
            closeCart: () => {
                set({ isOpen: false })
            },
            getTotalPrice: () => {
                const { items } = get()
                return items.reduce((total, item) => total + (item.price * item.quantity), 0)
            },
            getTotalItems: () => {
                const { items } = get()
                return items.reduce((total, item) => total + item.quantity, 0)
            },
            getItemCount: (productId: string) => {
                const { items } = get()
                const item = items.find(item => item.id === productId)
                return item ? item.quantity : 0
            }
        }),
        {
            name: 'cart-storage',
            skipHydration: true
        }
    )
)