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
        <div className="relative overflow-hidden w-full mt-10 group flex">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes marquee {
              0% { transform: translateX(0%); }
              100% { transform: translateX(-50%); }
            }
            .animate-marquee {
              animation: marquee 20s linear infinite;
            }
          `}} />
          <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
            <div className="flex min-w-max items-center">
              {brands.map((brand) => (
                <div key={brand.id} className="w-40 h-20 mx-4 shrink-0 rounded-xl bg-secondary/50 border border-border flex items-center justify-center p-4 transition-all duration-300 hover:border-primary/50 hover:bg-secondary hover:shadow-[0_0_15px_rgba(245,233,141,0.2)]">
                  <span className="text-xl font-bold text-muted-foreground hover:text-foreground transition-colors">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex min-w-max items-center">
              {brands.map((brand) => (
                <div key={brand.id + '-copy'} className="w-40 h-20 mx-4 shrink-0 rounded-xl bg-secondary/50 border border-border flex items-center justify-center p-4 transition-all duration-300 hover:border-primary/50 hover:bg-secondary hover:shadow-[0_0_15px_rgba(245,233,141,0.2)]">
                  <span className="text-xl font-bold text-muted-foreground hover:text-foreground transition-colors">
                    {brand.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
