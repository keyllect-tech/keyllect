'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useStore } from '@/lib/store'
import { getTranslation } from '@/lib/i18n'

export default function DeliveryPage() {
  const { locale } = useStore()
  const t = getTranslation(locale)

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto py-20 px-4">
          <h1 className="text-3xl font-bold mb-8 text-primary">{t.deliveryPage.title}</h1>
          <div className="text-foreground space-y-6 max-w-3xl leading-relaxed text-lg">
            <p>{t.deliveryPage.delivery}</p>
            <p>{t.deliveryPage.payment}</p>
            <p>{t.deliveryPage.pickup}</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
