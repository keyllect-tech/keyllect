'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { useStore } from '@/lib/store'
import { getTranslation } from '@/lib/i18n'
import { getProductById } from '@/lib/data'
import { Button } from '@/components/ui/button'

export default function FavoritesPage() {
  const { locale, favorites } = useStore()
  const t = getTranslation(locale)
  
  const favoriteProducts = favorites
    .map((id) => getProductById(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)

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
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              {t.nav.favorites}
            </h1>
            <p className="text-muted-foreground mt-2">
              {favoriteProducts.length} {locale === 'ru' ? 'товаров' : 'mahsulot'}
            </p>
          </motion.div>

          {favoriteProducts.length === 0 ? (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-24 h-24 rounded-full bg-card border border-border flex items-center justify-center mb-6">
                <Heart className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {locale === 'ru' ? 'Список избранного пуст' : "Sevimlilar ro'yxati bo'sh"}
              </h2>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                {locale === 'ru' 
                  ? 'Добавляйте понравившиеся товары в избранное, чтобы не потерять их' 
                  : "Yoqtirgan mahsulotlarni yo'qotmaslik uchun sevimlilarga qo'shing"}
              </p>
              <Link href="/catalog">
                <Button className="rounded-xl">
                  {locale === 'ru' ? 'Перейти в каталог' : 'Katalogga o\'tish'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          ) : (
            /* Products Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {favoriteProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
