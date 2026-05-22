'use client'

import { motion } from 'framer-motion'
import { useStore } from '@/lib/store'
import { getTranslation } from '@/lib/i18n'
import { brands } from '@/lib/data'

export function BrandsSection() {
  const { locale } = useStore()
  const t = getTranslation(locale)

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
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t.brands.title}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        {/* Brands Marquee */}
        <div className="relative overflow-hidden">
          <div className="flex items-center justify-center flex-wrap gap-8 lg:gap-16">
            {brands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="w-32 h-20 rounded-xl bg-secondary/50 border border-border flex items-center justify-center p-4 transition-all duration-300 group-hover:border-primary/30 group-hover:bg-secondary">
                  <span className="text-lg font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                    {brand.name}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
