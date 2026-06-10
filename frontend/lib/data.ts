export interface Product {
  id: string
  name: {
    ru: string
    uz: string
  }
  description: {
    ru: string
    uz: string
  }
  price: number
  originalPrice?: number
  images: string[]
  category: 'keyboards' | 'mice' | 'mousepads' | 'headsets' | 'accessories'
  brand: string
  rating: number
  reviewsCount: number
  stock: number
  inStock: boolean
  isNew?: boolean
  isBestseller?: boolean
  colors?: string[]
  specifications: {
    key: { ru: string; uz: string }
    value: { ru: string; uz: string }
  }[]
}

export interface Category {
  id: string
  name: {
    ru: string
    uz: string
  }
  slug: string
  image: string
  productCount: number
}

export interface Review {
  id: string
  author: string
  rating: number
  date: string
  text: {
    ru: string
    uz: string
  }
  productId?: string
}

export interface Brand {
  id: string
  name: string
  logo: string
}

// Mock Data
export const categories: Category[] = []

export const brands: Brand[] = [
  { id: '1', name: 'Cyberlynx' },
  { id: '2', name: 'Zifriend' },
  { id: '3', name: 'ATK' },
  { id: '4', name: 'GravaStar' },
  { id: '5', name: 'ZOWIE' },
  { id: '6', name: 'Xinmeng' },
  { id: '7', name: 'Ajazz' },
]

export const products: Product[] = []

export const reviews: Review[] = [
  {
    id: '1',
    author: 'Алексей К.',
    rating: 5,
    date: '2024-01-15',
    text: {
      ru: 'Отличный магазин! Заказал мышку ATK, доставили за 2 дня. Качество сборки на высоте, сенсор отличный.',
      uz: 'A\'lo do\'kon! ATK sichqonchasini buyurtma qildim, 2 kun ichida yetkazib berishdi. Yig\'ish sifati yuqori darajada, sensori ajoyib.',
    },
  },
  {
    id: '2',
    author: 'Мария С.',
    rating: 5,
    date: '2024-01-10',
    text: {
      ru: 'Покупала механическую клавиатуру Xinmeng в подарок мужу. Консультант помог выбрать идеальную модель. Очень довольна!',
      uz: 'Erimga sovg\'a uchun Xinmeng mexanik klaviaturasini sotib oldim. Maslahatchi ideal modelni tanlashga yordam berdi. Juda mamnunman!',
    },
  },
  {
    id: '3',
    author: 'Дмитрий В.',
    rating: 5,
    date: '2024-01-05',
    text: {
      ru: 'Хороший ассортимент кастомных девайсов и адекватные цены. Брал мышь от Cyberlynx — просто пушка, глайды отличные.',
      uz: 'Kastom qurilmalarning yaxshi assortimenti va mos narxlar. Cyberlynx sichqonchasini oldim — shunchaki ajoyib, glaydlari zo\'r.',
    },
  },
]

export function getProductById(productsArr: Product[], id: string): Product | undefined {
  return productsArr.find((p) => p.id === id)
}

export function getProductsByCategory(productsArr: Product[], category: string): Product[] {
  return productsArr.filter((p) => p.category === category)
}

export function getPopularProducts(): Product[] {
  return products.filter((p) => p.isBestseller || p.rating >= 4.7).slice(0, 8)
}

export function getNewProducts(products: Product[]): Product[] {
  return products.filter((p) => p.isNew)
}

export function searchProducts(products: Product[], query: string): Product[] {
  const lowerQuery = query.toLowerCase()
  return products.filter(
    (p) =>
      p.name.ru.toLowerCase().includes(lowerQuery) ||
      p.name.uz.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery)
  )
}

export function filterProducts(
  products: Product[],
  categorySlug?: string,
  brandFilter?: string[],
  minPrice?: number,
  maxPrice?: number,
  sortBy?: string
): Product[] {
  let filtered = [...products]
  
  if (categorySlug) {
    filtered = filtered.filter((p) => p.category === categorySlug)
  }
  
  if (brandFilter && brandFilter.length > 0) {
    filtered = filtered.filter((p) => brandFilter.includes(p.brand))
  }
  
  if (minPrice !== undefined) {
    filtered = filtered.filter((p) => p.price >= minPrice)
  }
  
  if (maxPrice !== undefined && maxPrice > 0) {
    filtered = filtered.filter((p) => p.price <= maxPrice)
  }
  
  switch (sortBy) {
    case 'priceAsc':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'priceDesc':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating)
      break
    case 'newest':
      filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
      break
    default:
      filtered.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0))
  }
  
  return filtered
}

export function getAllBrands(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.brand))]
}

export function getPriceRange(products: Product[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 0 }
  const prices = products.map((p) => p.price)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
}
