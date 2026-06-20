'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useStore } from '@/lib/store'
import { getTranslation } from '@/lib/i18n'

export default function PrivacyPage() {
  const { locale } = useStore()
  const t = getTranslation(locale)

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto py-20 px-4 max-w-3xl">
          <h1 className="text-3xl lg:text-4xl font-bold mb-10 text-primary">
            {t.privacyPage.title}
          </h1>
          <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 space-y-6 text-foreground leading-relaxed">
            <p>{t.privacyPage.p1}</p>
            <p>{t.privacyPage.p2}</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
