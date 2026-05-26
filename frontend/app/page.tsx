'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HeroSection } from '@/components/sections/hero-section'
import { CategoriesSection } from '@/components/sections/categories-section'
import { PopularProductsSection } from '@/components/sections/popular-products-section'
import { WhyUsSection } from '@/components/sections/why-us-section'
import { ReviewsSection } from '@/components/sections/reviews-section'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CategoriesSection />
        <PopularProductsSection />
        <WhyUsSection />
        <ReviewsSection />
      </main>
      <Footer />
    </>
  )
}
