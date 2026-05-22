'use client'

import { useState, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Minus, 
  Plus, 
  ChevronLeft,
  Truck,
  Shield,
  RotateCcw
} from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ProductCard } from '@/components/product-card'
import { useStore } from '@/lib/store'
import { getTranslation, formatPrice } from '@/lib/i18n'
import { getProductById, getProductsByCategory } from '@/lib/data'
import { Button } from '@/components/ui/button'
import { notFound } from 'next/navigation'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: ProductPageProps) {
  const { id } = use(params)
  const product = getProductById(id)
  
  if (!product) {
    notFound()
  }
  
  const { locale, addToCart, toggleFavorite, isFavorite } = useStore()
  const t = getTranslation(locale)
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description')
  
  const isProductFavorite = isFavorite(product.id)
  const relatedProducts = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  const handleAddToCart = () => {
    addToCart(product, quantity)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-muted-foreground mb-8"
          >
            <Link href="/" className="hover:text-foreground transition-colors">
              {t.nav.home}
            </Link>
            <span>/</span>
            <Link href="/catalog" className="hover:text-foreground transition-colors">
              {t.nav.catalog}
            </Link>
            <span>/</span>
            <span className="text-foreground">{product.name[locale]}</span>
          </motion.div>

          {/* Back Button */}
          <Link href="/catalog">
            <Button variant="ghost" className="mb-6 -ml-3">
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t.common.back}
            </Button>
          </Link>

          {/* Product Section */}
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-16">
            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name[locale]}
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-md">
                      NEW
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="px-3 py-1.5 text-xs font-semibold bg-red-500 text-white rounded-md">
                      -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name[locale]} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Brand */}
              <p className="text-sm font-medium text-primary">{product.brand}</p>

              {/* Name */}
              <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
                {product.name[locale]}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-muted-foreground">
                  {product.rating} ({product.reviewsCount} {t.products.reviews})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <p className="text-3xl font-bold text-foreground">
                  {formatPrice(product.price, locale)}
                </p>
                {product.originalPrice && (
                  <p className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.originalPrice, locale)}
                  </p>
                )}
              </div>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={product.inStock ? 'text-green-500' : 'text-red-500'}>
                  {product.inStock ? t.products.inStock : t.products.outOfStock}
                </span>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{t.cart.quantity}:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 rounded-lg border-border"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 rounded-lg border-border"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 h-14 text-base rounded-xl neon-glow"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {t.products.addToCart}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleFavorite(product.id)}
                  className={`h-14 w-14 rounded-xl border-border ${
                    isProductFavorite ? 'bg-red-500/10 border-red-500 text-red-500' : ''
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isProductFavorite ? 'fill-current' : ''}`} />
                </Button>
              </div>

              {/* Buy Now */}
              <Link href="/checkout">
                <Button
                  variant="outline"
                  className="w-full h-14 text-base rounded-xl border-border hover:bg-secondary"
                  onClick={() => addToCart(product, quantity)}
                >
                  {t.products.buyNow}
                </Button>
              </Link>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border">
                  <Truck className="w-6 h-6 text-primary" />
                  <span className="text-xs text-center text-muted-foreground">
                    {locale === 'ru' ? 'Быстрая доставка' : 'Tez yetkazib berish'}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border">
                  <Shield className="w-6 h-6 text-primary" />
                  <span className="text-xs text-center text-muted-foreground">
                    {locale === 'ru' ? 'Гарантия' : 'Kafolat'}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border">
                  <RotateCcw className="w-6 h-6 text-primary" />
                  <span className="text-xs text-center text-muted-foreground">
                    {locale === 'ru' ? 'Возврат 14 дней' : '14 kun qaytarish'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border mb-8">
            <div className="flex gap-8">
              {[
                { key: 'description', label: t.products.description },
                { key: 'specs', label: t.products.characteristics },
                { key: 'reviews', label: `${t.reviews.title} (${product.reviewsCount})` },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`pb-4 text-sm font-medium transition-colors relative ${
                    activeTab === tab.key
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            {activeTab === 'description' && (
              <p className="text-muted-foreground leading-relaxed max-w-3xl">
                {product.description[locale]}
              </p>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-2xl">
                <div className="space-y-3">
                  {product.specifications.map((spec, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-border"
                    >
                      <span className="text-muted-foreground">{spec.key[locale]}</span>
                      <span className="font-medium text-foreground">{spec.value[locale]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  {locale === 'ru' ? 'Отзывы скоро появятся' : "Sharhlar tez orada paydo bo'ladi"}
                </p>
                <Button variant="outline" className="rounded-xl">
                  {t.reviews.writeReview}
                </Button>
              </div>
            )}
          </motion.div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-8">
                {t.products.recommended}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
