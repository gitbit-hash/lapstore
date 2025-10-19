// app/components/StoreInitializer.tsx
'use client'

import { useEffect, useRef } from 'react'
import { useCartStore } from '../stores/cartStore'

export default function StoreInitializer() {
    const initialized = useRef(false)

    useEffect(() => {
        if (!initialized.current) {
            useCartStore.persist.rehydrate()
            initialized.current = true
        }
    }, [])

    return null
}