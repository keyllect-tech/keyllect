'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useStore } from '@/lib/store'
import { getTranslation } from '@/lib/i18n'

export default function TermsPage() {
  const { locale } = useStore()
  const t = getTranslation(locale)

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto py-20 px-4 max-w-3xl">
          <h1 className="text-3xl lg:text-4xl font-bold mb-10 text-primary">
            {t.termsPage.title}
          </h1>
          <div className="bg-card border border-border rounded-2xl p-6 lg:p-8 space-y-6 text-foreground leading-relaxed">
            <p>{t.termsPage.p1}</p>
            <p>{t.termsPage.p2}</p>
            <p>{t.termsPage.p3}</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
