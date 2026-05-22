'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useStore } from '@/lib/store'
import { getTranslation, formatPrice } from '@/lib/i18n'
import type { Product } from '@/lib/data'
import { Button } from '@/components/ui/button'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { locale, addToCart, toggleFavorite, isFavorite } = useStore()
  const t = getTranslation(locale)
  const isProductFavorite = isFavorite(product.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="product-card relative rounded-2xl bg-card border border-border overflow-hidden">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {product.isNew && (
            <span className="px-2.5 py-1 text-xs font-semibold bg-primary text-primary-foreground rounded-md">
              NEW
            </span>
          )}
          {product.isBestseller && (
            <span className="px-2.5 py-1 text-xs font-semibold bg-amber-500 text-white rounded-md">
              TOP
            </span>
          )}
          {product.originalPrice && (
            <span className="px-2.5 py-1 text-xs font-semibold bg-red-500 text-white rounded-md">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault()
            toggleFavorite(product.id)
          }}
          className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            isProductFavorite
              ? 'bg-red-500 text-white'
              : 'bg-background/80 backdrop-blur-sm text-muted-foreground hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 ${isProductFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Image */}
        <Link href={`/product/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-secondary/30">
            <Image
              src={product.images[0]}
              alt={product.name[locale]}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>

        {/* Content */}
        <div className="p-4">
          {/* Brand */}
          <p className="text-xs font-medium text-primary mb-1">{product.brand}</p>

          {/* Name */}
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
              {product.name[locale]}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(product.rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              ({product.reviewsCount} {t.products.reviews})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-foreground">
                {formatPrice(product.price, locale)}
              </p>
              {product.originalPrice && (
                <p className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice, locale)}
                </p>
              )}
            </div>
            <Button
              size="icon"
              onClick={(e) => {
                e.preventDefault()
                addToCart(product)
              }}
              className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
