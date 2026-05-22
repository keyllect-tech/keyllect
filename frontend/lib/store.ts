import { create } from 'zustand'
import type { Locale } from './i18n'
import type { Product } from './data'

export interface CartItem {
  product: Product
  quantity: number
}

interface StoreState {
  // Locale
  locale: Locale
  setLocale: (locale: Locale) => void
  
  // Cart
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartCount: () => number
  
  // Favorites
  favorites: string[]
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  
  // Search
  searchQuery: string
  setSearchQuery: (query: string) => void
  
  // Mobile menu
  isMobileMenuOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
}

export const useStore = create<StoreState>()((set, get) => ({
  // Locale
  locale: 'ru',
  setLocale: (locale) => set({ locale }),
  
  // Cart
  cart: [],
  addToCart: (product, quantity = 1) => {
    const cart = get().cart
    const existingItem = cart.find((item) => item.product.id === product.id)
    
    if (existingItem) {
      set({
        cart: cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ),
      })
    } else {
      set({ cart: [...cart, { product, quantity }] })
    }
  },
  removeFromCart: (productId) => {
    set({ cart: get().cart.filter((item) => item.product.id !== productId) })
  },
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(productId)
      return
    }
    set({
      cart: get().cart.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    })
  },
  clearCart: () => set({ cart: [] }),
  getCartTotal: () => {
    return get().cart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
  },
  getCartCount: () => {
    return get().cart.reduce((count, item) => count + item.quantity, 0)
  },
  
  // Favorites
  favorites: [],
  toggleFavorite: (productId) => {
    const favorites = get().favorites
    if (favorites.includes(productId)) {
      set({ favorites: favorites.filter((id) => id !== productId) })
    } else {
      set({ favorites: [...favorites, productId] })
    }
  },
  isFavorite: (productId) => get().favorites.includes(productId),
  
  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  // Mobile menu
  isMobileMenuOpen: false,
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
}))
