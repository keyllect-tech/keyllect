'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Search, Package } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useStore } from '@/lib/store'
import { getTranslation } from '@/lib/i18n'
import Link from 'next/link'

export default function DriversPage() {
  const { locale, products, isLoading } = useStore()
  const t = getTranslation(locale)
  const [search, setSearch] = useState('')

  // Collect all products that have drivers
  const productsWithDrivers = products.filter(p => p.drivers && p.drivers.length > 0)

  // Filter by search
  const filtered = productsWithDrivers.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.drivers!.some(d => d.name.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Download className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {locale === 'ru' ? 'Драйверы и ПО' : 'Drayverlar va Dasturlar'}
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              {locale === 'ru'
                ? 'Официальные драйверы и программное обеспечение для всех товаров Keyllect'
                : "Barcha Keyllect mahsulotlari uchun rasmiy drayverlar va dasturlar"}
            </p>
            <div className="w-20 h-1 bg-primary mx-auto rounded-full mt-6" />
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative max-w-md mx-auto mb-12"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={locale === 'ru' ? 'Поиск драйвера или товара...' : "Drayverni yoki mahsulotni qidiring..."}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            />
          </motion.div>

          {/* Drivers List */}
          {isLoading ? (
            <div className="text-center py-20 text-muted-foreground">
              {locale === 'ru' ? 'Загрузка...' : 'Yuklanmoqda...'}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground text-lg">
                {locale === 'ru' ? 'Драйверы не найдены' : "Drayverlar topilmadi"}
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {filtered.map((product, pIdx) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: pIdx * 0.05 }}
                >
                  {/* Product name */}
                  <div className="flex items-center gap-3 mb-4">
                    <Link
                      href={`/product/${product.id}`}
                      className="text-xl font-bold text-foreground hover:text-primary transition-colors"
                    >
                      {product.name}
                    </Link>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {product.drivers!.length} {locale === 'ru' ? 'файл' : 'fayl'}
                    </span>
                  </div>

                  {/* Driver cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {product.drivers!.map((driver, dIdx) => (
                      <a
                        key={dIdx}
                        href={driver.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-5 rounded-2xl bg-secondary/50 border border-border hover:border-primary/50 hover:bg-secondary/80 transition-all group"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {driver.name}
                          </span>
                          <span className="text-sm text-muted-foreground mt-1">
                            {locale === 'ru' ? 'Скачать с офиц. сайта' : 'Rasmiy saytdan yuklab olish'}
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0 ml-4">
                          <Download className="w-5 h-5 text-primary" />
                        </div>
                      </a>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
