'use client'

import { motion } from 'framer-motion'
import { Shield, Truck, CheckCircle, Headphones } from 'lucide-react'
import { useStore } from '@/lib/store'
import { getTranslation } from '@/lib/i18n'

export function WhyUsSection() {
  const { locale } = useStore()
  const t = getTranslation(locale)

  const features = [
    {
      icon: Shield,
      title: t.whyUs.warranty.title,
      description: t.whyUs.warranty.desc,
    },
    {
      icon: Truck,
      title: t.whyUs.delivery.title,
      description: t.whyUs.delivery.desc,
    },
    {
      icon: CheckCircle,
      title: t.whyUs.original.title,
      description: t.whyUs.original.desc,
    },
    {
      icon: Headphones,
      title: t.whyUs.support.title,
      description: t.whyUs.support.desc,
    },
  ]

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            {t.whyUs.title}
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
