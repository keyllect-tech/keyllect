import { create } from 'zustand'
import type { Locale } from './i18n'
import type { Product, Category } from './data'
import { apiUrl, mediaUrl } from './api'

export interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedColor?: string
  selectedImage?: string
}

interface User {
  phone: string;
  token: string;
}

interface StoreState {
  // Auth
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
  
  // Locale
  locale: Locale
  setLocale: (locale: Locale) => void
  
  // Cart
  cart: CartItem[]
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedImage?: string) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
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

  // Data from Backend
  products: Product[]
  categories: Category[]
  isLoading: boolean
  fetchData: () => Promise<void>
}

export const useStore = create<StoreState>()((set, get) => ({
  // Auth
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('keyllect_user') || 'null') : null,
  setUser: (user) => {
    if (typeof window !== 'undefined') {
      if (user) localStorage.setItem('keyllect_user', JSON.stringify(user))
      else localStorage.removeItem('keyllect_user')
    }
    set({ user })
  },
  logout: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('keyllect_user')
    set({ user: null })
  },

  // Locale
  locale: (typeof window !== 'undefined' ? localStorage.getItem('keyllect_locale') as Locale : null) || 'ru',
  setLocale: (locale) => {
    if (typeof window !== 'undefined') localStorage.setItem('keyllect_locale', locale)
    set({ locale })
  },
  
  // Cart
  cart: [],
  addToCart: (product, quantity = 1, selectedColor, selectedImage) => {
    const cart = get().cart
    const itemId = selectedColor ? `${product.id}-${selectedColor}` : product.id;
    const existingItem = cart.find((item) => item.id === itemId)
    
    if (existingItem) {
      set({
        cart: cart.map((item) =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity, selectedImage: selectedImage || item.selectedImage }
            : item
        ),
      })
    } else {
      set({ cart: [...cart, { id: itemId, product, quantity, selectedColor, selectedImage }] })
    }
  },
  removeFromCart: (itemId) => {
    set({ cart: get().cart.filter((item) => item.id !== itemId) })
  },
  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeFromCart(itemId)
      return
    }
    set({
      cart: get().cart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
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

  // Data from Backend
  products: [],
  categories: [],
  isLoading: true,
  fetchData: async () => {
    try {
      set({ isLoading: true })
      const [catRes, prodRes] = await Promise.all([
        fetch(apiUrl('/api/categories/')),
        fetch(apiUrl('/api/products/'))
      ])
      
      const rawCategories = await catRes.json()
      const rawProducts = await prodRes.json()

      const parsedCategories: Category[] = rawCategories.map((c: any) => ({
        id: String(c.id),
        name: { ru: c.name, uz: c.name_uz || c.name },
        slug: c.slug,
        image: c.image ? mediaUrl(c.image) : 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=300&fit=crop',
        productCount: 0
      }))

      const parsedProducts: Product[] = rawProducts.map((p: any) => {
        let categorySlug = p.category_slug || 'unknown'
        if (typeof p.category === 'object' && p.category) categorySlug = p.category.slug || String(p.category.id)
        else if (p.category && !p.category_slug) categorySlug = String(p.category)

        return {
          id: String(p.id),
          name: { ru: p.name, uz: p.name_uz || p.name },
          description: { ru: p.description, uz: p.description_uz || p.description },
          price: Number(p.price),
          originalPrice: p.old_price ? Number(p.old_price) : undefined,
          images: p.images?.length > 0 
            ? p.images.map((img: any) => img.image ? mediaUrl(img.image) : img) 
            : ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=600&fit=crop'],
          category: categorySlug,
          brand: p.brand,
          rating: Number(p.rating || 0),
          reviewsCount: 0,
          stock: p.stock ?? 0,
          inStock: p.in_stock,
          isBestseller: false,
          isNew: true,
          specifications: p.characteristics ? Object.entries(p.characteristics).map(([key, value], index) => {
            const uzEntries = p.characteristics_uz ? Object.entries(p.characteristics_uz) : [];
            const uzKey = uzEntries[index] ? uzEntries[index][0] : key;
            const uzValue = uzEntries[index] ? uzEntries[index][1] : undefined;
            return {
              key: { ru: key, uz: uzKey }, 
              value: { ru: String(value), uz: uzValue ? String(uzValue) : String(value) }
            };
          }) : [],
          colors: p.colors ? p.colors.split(',').map((c: string) => c.trim()) : [],
          drivers: p.drivers?.map((d: any) => ({ name: d.name, url: d.url })) || []
        }
      })

      // Count products per category
      parsedCategories.forEach(cat => {
        cat.productCount = parsedProducts.filter(p => p.category === cat.slug || p.category === String(cat.id)).length
      })

      set({ categories: parsedCategories, products: parsedProducts, isLoading: false })
    } catch (error) {
      console.error("Failed to fetch data:", error)
      set({ isLoading: false })
    }
  }
}))
