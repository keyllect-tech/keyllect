'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useStore } from '@/lib/store'
import { getTranslation } from '@/lib/i18n'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default function FAQPage() {
  const { locale } = useStore()
  const t = getTranslation(locale)

  const faqs = [
    { q: t.faqPage.q1, a: t.faqPage.a1 },
    { q: t.faqPage.q2, a: t.faqPage.a2 },
    { q: t.faqPage.q3, a: t.faqPage.a3 },
    { q: t.faqPage.q4, a: t.faqPage.a4 },
    { q: t.faqPage.q5, a: t.faqPage.a5 },
  ]

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto py-10 px-4 max-w-3xl">
          <h1 className="text-3xl lg:text-4xl font-bold mb-10 text-primary text-center">
            {t.faqPage.title}
          </h1>
          <div className="bg-card border border-border rounded-2xl p-6 lg:p-8">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-base lg:text-lg font-semibold text-foreground hover:text-primary transition-colors">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed pt-2">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
