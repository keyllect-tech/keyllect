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
  inStock: boolean
  isNew?: boolean
  isBestseller?: boolean
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
export const categories: Category[] = [
  {
    id: '1',
    name: { ru: 'Клавиатуры', uz: 'Klaviaturalar' },
    slug: 'keyboards',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=300&fit=crop',
    productCount: 48,
  },
  {
    id: '2',
    name: { ru: 'Мыши', uz: 'Sichqonchalar' },
    slug: 'mice',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
    productCount: 36,
  },
  {
    id: '3',
    name: { ru: 'Коврики', uz: 'Gilamchalar' },
    slug: 'mousepads',
    image: 'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=400&h=300&fit=crop',
    productCount: 24,
  },
  {
    id: '4',
    name: { ru: 'Наушники', uz: 'Quloqliklar' },
    slug: 'headsets',
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400&h=300&fit=crop',
    productCount: 32,
  },
]

export const brands: Brand[] = [
  { id: '1', name: 'Logitech', logo: '/brands/logitech.svg' },
  { id: '2', name: 'Razer', logo: '/brands/razer.svg' },
  { id: '3', name: 'SteelSeries', logo: '/brands/steelseries.svg' },
  { id: '4', name: 'HyperX', logo: '/brands/hyperx.svg' },
  { id: '5', name: 'ASUS ROG', logo: '/brands/asus-rog.svg' },
  { id: '6', name: 'Corsair', logo: '/brands/corsair.svg' },
]

export const products: Product[] = [
  {
    id: '1',
    name: {
      ru: 'Logitech G Pro X Superlight 2',
      uz: 'Logitech G Pro X Superlight 2',
    },
    description: {
      ru: 'Беспроводная игровая мышь весом всего 60 грамм с датчиком HERO 2 и автономностью до 95 часов. Идеальный выбор для профессиональных киберспортсменов.',
      uz: '60 gramm og\'irlikdagi simsiz o\'yin sichqonchasi HERO 2 sensori va 95 soatgacha batareya quvvati bilan. Professional kibersportchilar uchun ideal tanlov.',
    },
    price: 2490000,
    originalPrice: 2790000,
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&h=600&fit=crop',
    ],
    category: 'mice',
    brand: 'Logitech',
    rating: 4.9,
    reviewsCount: 234,
    inStock: true,
    isBestseller: true,
    specifications: [
      { key: { ru: 'Тип подключения', uz: 'Ulanish turi' }, value: { ru: 'Беспроводное', uz: 'Simsiz' } },
      { key: { ru: 'Датчик', uz: 'Sensor' }, value: { ru: 'HERO 2', uz: 'HERO 2' } },
      { key: { ru: 'DPI', uz: 'DPI' }, value: { ru: '32 000', uz: '32 000' } },
      { key: { ru: 'Вес', uz: 'Og\'irlik' }, value: { ru: '60 г', uz: '60 g' } },
      { key: { ru: 'Автономность', uz: 'Batareya' }, value: { ru: 'до 95 часов', uz: '95 soatgacha' } },
    ],
  },
  {
    id: '2',
    name: {
      ru: 'Razer BlackWidow V4 Pro',
      uz: 'Razer BlackWidow V4 Pro',
    },
    description: {
      ru: 'Механическая игровая клавиатура с переключателями Razer Green, RGB подсветкой Chroma и программируемым командным диском.',
      uz: 'Razer Green kalitlari, Chroma RGB yoritgichi va dasturlashtiriladigan buyruq diski bilan mexanik o\'yin klaviaturasi.',
    },
    price: 4590000,
    images: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=600&fit=crop',
    ],
    category: 'keyboards',
    brand: 'Razer',
    rating: 4.8,
    reviewsCount: 156,
    inStock: true,
    isNew: true,
    specifications: [
      { key: { ru: 'Тип переключателей', uz: 'Kalit turi' }, value: { ru: 'Razer Green', uz: 'Razer Green' } },
      { key: { ru: 'Подсветка', uz: 'Yoritgich' }, value: { ru: 'RGB Chroma', uz: 'RGB Chroma' } },
      { key: { ru: 'Раскладка', uz: 'Tartibi' }, value: { ru: 'Full-size', uz: 'Full-size' } },
      { key: { ru: 'Подключение', uz: 'Ulanish' }, value: { ru: 'USB-C', uz: 'USB-C' } },
    ],
  },
  {
    id: '3',
    name: {
      ru: 'SteelSeries Arctis Nova Pro Wireless',
      uz: 'SteelSeries Arctis Nova Pro Wireless',
    },
    description: {
      ru: 'Премиальная беспроводная гарнитура с активным шумоподавлением, Hi-Res звуком и базовой станцией для бесперебойной работы.',
      uz: 'Faol shovqinni bostirish, Hi-Res ovoz va uzluksiz ishlash uchun baza stantsiyasi bilan premium simsiz garnitura.',
    },
    price: 6290000,
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop',
    ],
    category: 'headsets',
    brand: 'SteelSeries',
    rating: 4.9,
    reviewsCount: 89,
    inStock: true,
    isBestseller: true,
    specifications: [
      { key: { ru: 'Тип', uz: 'Turi' }, value: { ru: 'Беспроводные', uz: 'Simsiz' } },
      { key: { ru: 'Шумоподавление', uz: 'Shovqinni bostirish' }, value: { ru: 'Активное (ANC)', uz: 'Faol (ANC)' } },
      { key: { ru: 'Драйверы', uz: 'Drayverlar' }, value: { ru: '40 мм', uz: '40 mm' } },
      { key: { ru: 'Частотный диапазон', uz: 'Chastota diapazoni' }, value: { ru: '10 Гц - 40 кГц', uz: '10 Hz - 40 kHz' } },
    ],
  },
  {
    id: '4',
    name: {
      ru: 'Artisan Hien FX XL Soft',
      uz: 'Artisan Hien FX XL Soft',
    },
    description: {
      ru: 'Профессиональный игровой коврик японского производства с уникальной текстурой для идеального баланса скорости и контроля.',
      uz: 'Yaponiyada ishlab chiqarilgan professional o\'yin gilamchasi, tezlik va nazoratning mukammal muvozanati uchun noyob tekstura bilan.',
    },
    price: 1290000,
    images: [
      'https://images.unsplash.com/photo-1616763355548-1b606f439f86?w=800&h=600&fit=crop',
    ],
    category: 'mousepads',
    brand: 'Artisan',
    rating: 4.7,
    reviewsCount: 67,
    inStock: true,
    specifications: [
      { key: { ru: 'Размер', uz: 'O\'lchami' }, value: { ru: '490 x 420 x 4 мм', uz: '490 x 420 x 4 mm' } },
      { key: { ru: 'Поверхность', uz: 'Sirt' }, value: { ru: 'Ткань', uz: 'Mato' } },
      { key: { ru: 'Жёсткость', uz: 'Qattiqlik' }, value: { ru: 'Soft', uz: 'Soft' } },
      { key: { ru: 'Страна', uz: 'Mamlakat' }, value: { ru: 'Япония', uz: 'Yaponiya' } },
    ],
  },
  {
    id: '5',
    name: {
      ru: 'HyperX Cloud III Wireless',
      uz: 'HyperX Cloud III Wireless',
    },
    description: {
      ru: 'Беспроводная игровая гарнитура с 53мм драйверами, DTS Headphone:X и до 120 часов автономной работы.',
      uz: '53mm drayverlar, DTS Headphone:X va 120 soatgacha avtonom ishlash bilan simsiz o\'yin garniturasi.',
    },
    price: 2890000,
    originalPrice: 3290000,
    images: [
      'https://images.unsplash.com/photo-1599669454699-248893623440?w=800&h=600&fit=crop',
    ],
    category: 'headsets',
    brand: 'HyperX',
    rating: 4.6,
    reviewsCount: 178,
    inStock: true,
    specifications: [
      { key: { ru: 'Тип', uz: 'Turi' }, value: { ru: 'Беспроводные', uz: 'Simsiz' } },
      { key: { ru: 'Драйверы', uz: 'Drayverlar' }, value: { ru: '53 мм', uz: '53 mm' } },
      { key: { ru: 'Автономность', uz: 'Batareya' }, value: { ru: 'до 120 часов', uz: '120 soatgacha' } },
      { key: { ru: 'Вес', uz: 'Og\'irlik' }, value: { ru: '330 г', uz: '330 g' } },
    ],
  },
  {
    id: '6',
    name: {
      ru: 'ASUS ROG Azoth',
      uz: 'ASUS ROG Azoth',
    },
    description: {
      ru: 'Компактная беспроводная механическая клавиатура 75% с OLED-дисплеем, трёхрежимным подключением и кастомизацией свитчей.',
      uz: 'OLED displey, uch rejimli ulanish va kalit moslashtirish bilan 75% kompakt simsiz mexanik klaviatura.',
    },
    price: 5490000,
    images: [
      'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&h=600&fit=crop',
    ],
    category: 'keyboards',
    brand: 'ASUS ROG',
    rating: 4.8,
    reviewsCount: 92,
    inStock: true,
    isNew: true,
    specifications: [
      { key: { ru: 'Форм-фактор', uz: 'Form-faktor' }, value: { ru: '75%', uz: '75%' } },
      { key: { ru: 'Переключатели', uz: 'Kalitlar' }, value: { ru: 'ROG NX', uz: 'ROG NX' } },
      { key: { ru: 'Подключение', uz: 'Ulanish' }, value: { ru: '2.4GHz / Bluetooth / USB', uz: '2.4GHz / Bluetooth / USB' } },
      { key: { ru: 'Дисплей', uz: 'Displey' }, value: { ru: 'OLED', uz: 'OLED' } },
    ],
  },
  {
    id: '7',
    name: {
      ru: 'Razer DeathAdder V3 Pro',
      uz: 'Razer DeathAdder V3 Pro',
    },
    description: {
      ru: 'Эргономичная беспроводная мышь с датчиком Focus Pro 30K и весом всего 63 грамма. Легенда киберспорта в новом исполнении.',
      uz: 'Focus Pro 30K sensori va 63 gramm og\'irlik bilan ergonomik simsiz sichqoncha. Kibersport afsonasi yangi ko\'rinishda.',
    },
    price: 2690000,
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&h=600&fit=crop',
    ],
    category: 'mice',
    brand: 'Razer',
    rating: 4.8,
    reviewsCount: 203,
    inStock: true,
    isBestseller: true,
    specifications: [
      { key: { ru: 'Датчик', uz: 'Sensor' }, value: { ru: 'Focus Pro 30K', uz: 'Focus Pro 30K' } },
      { key: { ru: 'DPI', uz: 'DPI' }, value: { ru: '30 000', uz: '30 000' } },
      { key: { ru: 'Вес', uz: 'Og\'irlik' }, value: { ru: '63 г', uz: '63 g' } },
      { key: { ru: 'Автономность', uz: 'Batareya' }, value: { ru: 'до 90 часов', uz: '90 soatgacha' } },
    ],
  },
  {
    id: '8',
    name: {
      ru: 'Corsair K100 RGB',
      uz: 'Corsair K100 RGB',
    },
    description: {
      ru: 'Флагманская механическая клавиатура с оптико-механическими переключателями OPX, iCUE Control Wheel и PBT-кейкапами.',
      uz: 'OPX optik-mexanik kalitlari, iCUE Control Wheel va PBT keycaps bilan flagman mexanik klaviatura.',
    },
    price: 4890000,
    images: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=600&fit=crop',
    ],
    category: 'keyboards',
    brand: 'Corsair',
    rating: 4.7,
    reviewsCount: 145,
    inStock: true,
    specifications: [
      { key: { ru: 'Переключатели', uz: 'Kalitlar' }, value: { ru: 'Corsair OPX', uz: 'Corsair OPX' } },
      { key: { ru: 'Раскладка', uz: 'Tartibi' }, value: { ru: 'Full-size', uz: 'Full-size' } },
      { key: { ru: 'Подсветка', uz: 'Yoritgich' }, value: { ru: 'RGB per-key', uz: 'RGB per-key' } },
      { key: { ru: 'Кейкапы', uz: 'Keycaps' }, value: { ru: 'PBT Double-Shot', uz: 'PBT Double-Shot' } },
    ],
  },
]

export const reviews: Review[] = [
  {
    id: '1',
    author: 'Алексей К.',
    rating: 5,
    date: '2024-01-15',
    text: {
      ru: 'Отличный магазин! Заказал мышку Logitech, доставили за 2 дня. Всё оригинальное, с гарантией.',
      uz: 'A\'lo do\'kon! Logitech sichqonchasini buyurtma qildim, 2 kun ichida yetkazib berdi. Hammasi original, kafolatli.',
    },
  },
  {
    id: '2',
    author: 'Мария С.',
    rating: 5,
    date: '2024-01-10',
    text: {
      ru: 'Покупала клавиатуру в подарок мужу. Консультант помог выбрать идеальную модель. Очень довольна!',
      uz: 'Erimga sovg\'a uchun klaviatura sotib oldim. Maslahatchi ideal modelni tanlashga yordam berdi. Juda mamnunman!',
    },
  },
  {
    id: '3',
    author: 'Дмитрий В.',
    rating: 4,
    date: '2024-01-05',
    text: {
      ru: 'Хороший ассортимент и адекватные цены. Единственное — хотелось бы больше моделей наушников.',
      uz: 'Yaxshi assortiment va mos narxlar. Yagona narsa — ko\'proq quloqlik modellari bo\'lsa yaxshi bo\'lardi.',
    },
  },
]

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category)
}

export function getPopularProducts(): Product[] {
  return products.filter((p) => p.isBestseller || p.rating >= 4.7).slice(0, 8)
}

export function getNewProducts(): Product[] {
  return products.filter((p) => p.isNew)
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase()
  return products.filter(
    (p) =>
      p.name.ru.toLowerCase().includes(lowerQuery) ||
      p.name.uz.toLowerCase().includes(lowerQuery) ||
      p.brand.toLowerCase().includes(lowerQuery)
  )
}

export function filterProducts(
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
  
  if (maxPrice !== undefined) {
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

export function getAllBrands(): string[] {
  return [...new Set(products.map((p) => p.brand))]
}

export function getPriceRange(): { min: number; max: number } {
  const prices = products.map((p) => p.price)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  }
}
