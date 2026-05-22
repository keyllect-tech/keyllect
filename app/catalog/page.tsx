'use client'

import { useState, useMemo, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ChevronDown,
  Grid3X3,
  LayoutList
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { useStore } from '@/lib/store'
import { getTranslation, formatPrice } from '@/lib/i18n'
import { 
  filterProducts, 
  getAllBrands, 
  getPriceRange,
  categories 
} from '@/lib/data'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'

function CatalogContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || ''
  
  const { locale } = useStore()
  const t = getTranslation(locale)
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000])
  const [sortBy, setSortBy] = useState('popular')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const allBrands = getAllBrands()
  const { min: minPrice, max: maxPrice } = getPriceRange()
  
  const filteredProducts = useMemo(() => {
    let products = filterProducts(
      selectedCategory || undefined,
      selectedBrands.length > 0 ? selectedBrands : undefined,
      priceRange[0],
      priceRange[1],
      sortBy
    )
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      products = products.filter(
        (p) =>
          p.name.ru.toLowerCase().includes(query) ||
          p.name.uz.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query)
      )
    }
    
    return products
  }, [selectedCategory, selectedBrands, priceRange, sortBy, searchQuery])
  
  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand)
        ? prev.filter((b) => b !== brand)
        : [...prev, brand]
    )
  }
  
  const resetFilters = () => {
    setSelectedCategory('')
    setSelectedBrands([])
    setPriceRange([0, 10000000])
    setSortBy('popular')
    setSearchQuery('')
  }

  const sortOptions = [
    { value: 'popular', label: t.products.sortOptions.popular },
    { value: 'priceAsc', label: t.products.sortOptions.priceAsc },
    { value: 'priceDesc', label: t.products.sortOptions.priceDesc },
    { value: 'rating', label: t.products.sortOptions.rating },
    { value: 'newest', label: t.products.sortOptions.newest },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {t.nav.catalog}
            </h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} {locale === 'ru' ? 'товаров' : 'mahsulot'}
            </p>
          </motion.div>

          {/* Search & Controls */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={t.nav.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>

            {/* Controls */}
            <div className="flex gap-3">
              {/* Filter Toggle (Mobile) */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden h-12 px-4 rounded-xl border-border"
              >
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                {t.products.filter}
              </Button>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-12 pl-4 pr-10 rounded-xl bg-card border border-border text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="hidden sm:flex rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`h-12 w-12 flex items-center justify-center transition-colors ${
                    viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`h-12 w-12 flex items-center justify-center transition-colors ${
                    viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <LayoutList className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <aside className={`
              ${showFilters ? 'fixed inset-0 z-50 bg-background p-6 overflow-auto lg:static lg:inset-auto lg:z-auto lg:p-0' : 'hidden lg:block'}
              w-full lg:w-64 flex-shrink-0
            `}>
              {/* Mobile Close Button */}
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h2 className="text-lg font-semibold">{t.products.filter}</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">{t.categories.title}</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-colors ${
                      selectedCategory === '' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                    }`}
                  >
                    {locale === 'ru' ? 'Все категории' : 'Barcha kategoriyalar'}
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.slug)}
                      className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.slug 
                          ? 'bg-primary text-primary-foreground' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }`}
                    >
                      {category.name[locale]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">{t.products.price}</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0] || ''}
                      onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                      className="w-full h-10 px-3 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1] || ''}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || maxPrice])}
                      className="w-full h-10 px-3 rounded-lg bg-card border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatPrice(minPrice, locale)} — {formatPrice(maxPrice, locale)}
                  </p>
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h3 className="font-semibold text-foreground mb-3">{t.products.brand}</h3>
                <div className="space-y-2">
                  {allBrands.map((brand) => (
                    <label
                      key={brand}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          selectedBrands.includes(brand)
                            ? 'bg-primary border-primary'
                            : 'border-border group-hover:border-primary/50'
                        }`}
                      >
                        {selectedBrands.includes(brand) && (
                          <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span
                        className="text-sm text-muted-foreground group-hover:text-foreground transition-colors"
                        onClick={() => toggleBrand(brand)}
                      >
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reset Filters */}
              <Button
                variant="outline"
                onClick={resetFilters}
                className="w-full rounded-xl border-border"
              >
                {t.products.resetFilters}
              </Button>

              {/* Apply Button (Mobile) */}
              <Button
                onClick={() => setShowFilters(false)}
                className="w-full mt-3 rounded-xl lg:hidden"
              >
                {locale === 'ru' ? 'Применить' : 'Qo\'llash'}
              </Button>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <p className="text-muted-foreground text-lg">{t.common.noResults}</p>
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="mt-4 rounded-xl"
                  >
                    {t.products.resetFilters}
                  </Button>
                </motion.div>
              ) : (
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  <AnimatePresence mode="popLayout">
                    {filteredProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-24 flex items-center justify-center">Loading...</div>}>
      <CatalogContent />
    </Suspense>
  )
}
