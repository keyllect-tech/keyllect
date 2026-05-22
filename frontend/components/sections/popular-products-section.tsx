'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useStore } from '@/lib/store'
import { getTranslation } from '@/lib/i18n'
import { getPopularProducts } from '@/lib/data'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'

export function PopularProductsSection() {
  const { locale } = useStore()
  const t = getTranslation(locale)
  const products = getPopularProducts()

  return (
    <section id="popular" className="py-24 bg-card/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {t.products.title}
            </h2>
            <div className="w-20 h-1 bg-primary rounded-full" />
          </div>
          <Link href="/catalog">
            <Button variant="outline" className="rounded-xl border-border hover:bg-secondary">
              {t.products.viewAll}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
