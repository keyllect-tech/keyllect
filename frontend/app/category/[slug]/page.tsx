'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { useStore } from '@/lib/store'
import { categorySEOData } from '@/lib/seo-data'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params)
  const { categories, products, isLoading } = useStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const category = categories.find((c) => c.slug === slug)
  const seo = categorySEOData[slug] || { h1: category?.name?.ru || 'Категория', text: '' }
  
  if (!category && !isLoading) {
    notFound()
  }

  const categoryProducts = products.filter((p) => p.category === slug)

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          
          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {seo.h1}
            </h1>
            <p className="text-muted-foreground">
              {categoryProducts.length} товаров в категории
            </p>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-16">
            {categoryProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
            {categoryProducts.length === 0 && (
              <p className="text-muted-foreground py-10 col-span-full">В данной категории пока нет товаров.</p>
            )}
          </div>

          {/* SEO Text Block */}
          {seo.text && (
            <section className="prose prose-invert max-w-4xl mx-auto mt-16 p-6 rounded-2xl glass">
              <div dangerouslySetInnerHTML={{ __html: seo.text }} />
            </section>
          )}

        </div>
      </main>
      <Footer />
    </>
  )
}
