'use client'

import { motion } from 'framer-motion'
import { Target, Award, Users, Sparkles } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useStore } from '@/lib/store'
import { getTranslation } from '@/lib/i18n'

export default function AboutPage() {
  const { locale } = useStore()
  const t = getTranslation(locale)

  const values = [
    {
      icon: Award,
      title: t.about.quality,
      description: t.about.qualityText,
    },
    {
      icon: Users,
      title: t.about.service,
      description: t.about.serviceText,
    },
    {
      icon: Sparkles,
      title: t.about.trust,
      description: t.about.trustText,
    },
  ]

  const stats = [
    { value: '5000+', label: locale === 'ru' ? 'Довольных клиентов' : 'Mamnun mijozlar' },
    { value: '50+', label: locale === 'ru' ? 'Партнёрских брендов' : 'Hamkor brendlar' },
    { value: '3', label: locale === 'ru' ? 'Года на рынке' : "Yil bozorda" },
    { value: '24/7', label: locale === 'ru' ? 'Поддержка клиентов' : "Mijozlarni qo'llab-quvvatlash" },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t.about.title}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t.about.subtitle}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8 mb-16"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-card border border-border text-center"
              >
                <p className="text-3xl lg:text-4xl font-bold text-primary mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                {t.about.mission}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t.about.missionText}
              </p>
            </div>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl lg:text-3xl font-bold text-foreground text-center mb-10">
              {t.about.values}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="p-8 rounded-2xl bg-card border border-border text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 p-8 lg:p-12 rounded-3xl bg-card border border-border"
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {locale === 'ru' ? 'Наша история' : 'Bizning tariximiz'}
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  {locale === 'ru'
                    ? 'Keyllect появился в 2025 году — из любви к качественной периферии и желания сделать её доступной в Узбекистане. Мы начинали как небольшой проект, а сегодня обслуживаем как частных покупателей, так и игровые клубы по всей стране.'
                    : "Keyllect 2025-yilda sifatli periferiyaga bo'lgan muhabbat va uni O'zbekistonda hamyonbop qilish istagi tufayli paydo bo'ldi. Biz kichik loyiha sifatida boshlaganmiz, bugungi kunda esa butun mamlakat bo'ylab ham xususiy xaridorlarga, ham o'yin klublariga xizmat ko'rsatamiz."}
                </p>
                <p>
                  {locale === 'ru'
                    ? 'Каждый продукт в нашем каталоге проходит личную проверку — мы не продаём то, в чём не уверены сами.'
                    : "Katalogimizdagi har bir mahsulot shaxsiy tekshiruvdan o'tadi — biz o'zimiz ishonch hosil qilmagan narsani sotmaymiz."}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
