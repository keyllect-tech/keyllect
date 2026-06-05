'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useStore } from '@/lib/store'
import { getTranslation, formatPrice } from '@/lib/i18n'
import { Button } from '@/components/ui/button'

export default function CartPage() {
  const { locale, cart, updateQuantity, removeFromCart, getCartTotal } = useStore()
  const t = getTranslation(locale)
  const cartTotal = getCartTotal()
  const shippingCost = cartTotal >= 500000 ? 0 : 50000

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              {t.cart.title}
            </h1>
          </motion.div>

          {cart.length === 0 ? (
            /* Empty Cart */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-24 h-24 rounded-full bg-card border border-border flex items-center justify-center mb-6">
                <ShoppingBag className="w-12 h-12 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {t.cart.empty}
              </h2>
              <p className="text-muted-foreground mb-6">
                {locale === 'ru' 
                  ? 'Добавьте товары для оформления заказа' 
                  : "Buyurtma berish uchun mahsulotlar qo'shing"}
              </p>
              <Link href="/catalog">
                <Button className="rounded-xl">
                  {t.cart.continueShopping}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {cart.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 p-4 rounded-2xl bg-card border border-border"
                    >
                      {/* Image */}
                      <Link href={`/product/${item.product.id}`} className="flex-shrink-0">
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-secondary">
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name[locale]}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-xs text-primary font-medium mb-1">
                              {item.product.brand}
                            </p>
                            <Link href={`/product/${item.product.id}`}>
                              <h3 className="font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors">
                                {item.product.name[locale]}
                              </h3>
                            </Link>
                            {item.selectedColor && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {locale === 'ru' ? 'Цвет:' : 'Rang:'} {item.selectedColor}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-end justify-between mt-4">
                          {/* Quantity */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-semibold text-foreground">
                              {formatPrice(item.product.price * item.quantity, locale)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-muted-foreground">
                                {formatPrice(item.product.price, locale)} x {item.quantity}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="sticky top-28 p-6 rounded-2xl bg-card border border-border"
                >
                  <h2 className="text-lg font-semibold text-foreground mb-6">
                    {locale === 'ru' ? 'Ваш заказ' : 'Sizning buyurtmangiz'}
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.cart.subtotal}</span>
                      <span className="font-medium text-foreground">
                        {formatPrice(cartTotal, locale)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t.cart.shipping}</span>
                      <span className="font-medium text-foreground">
                        {shippingCost === 0 ? t.cart.free : formatPrice(shippingCost, locale)}
                      </span>
                    </div>
                    {shippingCost > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {locale === 'ru' 
                          ? `Бесплатная доставка от ${formatPrice(500000, locale)}` 
                          : `${formatPrice(500000, locale)} dan bepul yetkazib berish`}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between py-4 border-t border-border mb-6">
                    <span className="text-lg font-semibold text-foreground">{t.cart.total}</span>
                    <span className="text-lg font-bold text-foreground">
                      {formatPrice(cartTotal + shippingCost, locale)}
                    </span>
                  </div>

                  <Link href="/checkout" className="block">
                    <Button className="w-full h-14 text-base rounded-xl neon-glow">
                      {t.cart.checkout}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>

                  <Link href="/catalog" className="block mt-3">
                    <Button variant="outline" className="w-full h-12 rounded-xl border-border">
                      {t.cart.continueShopping}
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
