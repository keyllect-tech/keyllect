'use client'

import { motion } from 'framer-motion'
import { Download, ArrowRight } from 'lucide-react'
import { useStore } from '@/lib/store'
import { getTranslation } from '@/lib/i18n'
import Link from 'next/link'

export function DriversSection() {
  const { locale, products } = useStore()
  const t = getTranslation(locale)

  // Get products that have drivers and collect first 6 drivers total
  const driversPreview: { name: string; url: string; productName: string; productId: string | number }[] = []
  for (const product of products) {
    if (product.drivers && product.drivers.length > 0) {
      for (const driver of product.drivers) {
        driversPreview.push({
          name: driver.name,
          url: driver.url,
          productName: product.name,
          productId: product.id
        })
        if (driversPreview.length >= 6) break
      }
    }
    if (driversPreview.length >= 6) break
  }

  if (driversPreview.length === 0) return null

  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Download className="w-5 h-5 text-primary" />
            </div>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {locale === 'ru' ? 'Драйверы и ПО' : 'Drayverlar va Dasturlar'}
          </h2>
          <p className="text-muted-foreground text-lg">
            {locale === 'ru'
              ? 'Официальные драйверы для устройств Keyllect'
              : "Keyllect qurilmalari uchun rasmiy drayverlar"}
          </p>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full mt-4" />
        </motion.div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {driversPreview.map((driver, idx) => (
            <motion.a
              key={idx}
              href={driver.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center justify-between p-5 rounded-2xl bg-secondary/50 border border-border hover:border-primary/50 hover:bg-secondary/80 transition-all group"
            >
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                  {driver.name}
                </span>
                <span className="text-sm text-muted-foreground mt-1 truncate">
                  {driver.productName}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center group-hover:bg-primary/20 transition-colors flex-shrink-0 ml-4">
                <Download className="w-5 h-5 text-primary" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link
            href="/drivers"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors neon-glow"
          >
            {locale === 'ru' ? 'Все драйверы' : "Barcha drayverlar"}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
