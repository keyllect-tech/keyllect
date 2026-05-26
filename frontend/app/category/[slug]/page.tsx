import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductsByCategory, categories } from '@/lib/data'
import { categorySEOData } from '@/lib/seo-data'
import { apiUrl, mediaUrl } from '@/lib/api'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const seo = categorySEOData[slug]

  if (!seo) {
    return { title: 'Категория не найдена' }
  }

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: `https://keyllect.uz/category/${slug}`,
    },
    alternates: {
      canonical: `https://keyllect.uz/category/${slug}`,
    }
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  
  // Server-side fetch
  const [catRes, prodRes] = await Promise.all([
    fetch(apiUrl('/api/categories/'), { cache: 'no-store' }).catch(() => null),
    fetch(apiUrl('/api/products/'), { cache: 'no-store' }).catch(() => null)
  ])
  
  const rawCategories = catRes ? await catRes.json() : []
  const rawProducts = prodRes ? await prodRes.json() : []

  const category = rawCategories.find((c: any) => c.slug === slug)
  const seo = categorySEOData[slug] || { h1: category?.name, text: '' }
  
  if (!category) {
    notFound()
  }

  const products = rawProducts.filter((p: any) => p.category === slug || p.category?.slug === slug || p.category?.id === category.id).map((p: any) => ({
    id: String(p.id),
    name: { ru: p.name, uz: p.name },
    description: { ru: p.description, uz: p.description },
    price: Number(p.price),
    originalPrice: p.old_price ? Number(p.old_price) : undefined,
    images: p.images?.length > 0 ? p.images.map((img: any) => img.image ? mediaUrl(img.image) : img) : ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&h=600&fit=crop'],
    category: slug,
    brand: p.brand,
    rating: Number(p.rating || 0),
    reviewsCount: 0,
    inStock: p.in_stock,
    isBestseller: false,
    isNew: true,
    specifications: []
  }))

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
              {products.length} товаров в категории
            </p>
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-16">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
            {products.length === 0 && (
              <p className="text-muted-foreground py-10 col-span-full">В данной категории пока нет товаров.</p>
            )}
          </div>

          {/* SEO Text Block */}
          <section className="prose prose-invert max-w-4xl mx-auto mt-16 p-6 rounded-2xl glass">
            <div dangerouslySetInnerHTML={{ __html: seo.text }} />
          </section>

        </div>
      </main>
      <Footer />
    </>
  )
}
