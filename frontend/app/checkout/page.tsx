'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ChevronLeft, CheckCircle, CreditCard, Banknote } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useStore } from '@/lib/store'
import { getTranslation, formatPrice } from '@/lib/i18n'
import { apiUrl } from '@/lib/api'
import { Button } from '@/components/ui/button'

export default function CheckoutPage() {
  const { locale, cart, getCartTotal, clearCart, user } = useStore()
  const t = getTranslation(locale)
  const cartTotal = getCartTotal()
  const shippingCost = cartTotal >= 500000 ? 0 : 50000
  
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    comment: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const newOrderNumber = `KL-${Date.now().toString(36).toUpperCase()}`
    
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (user?.token) {
        headers['Authorization'] = `Bearer ${user.token}`
      }

      let response = await fetch(apiUrl('/api/checkout/'), {
        method: 'POST',
        headers,
        body: JSON.stringify({
          order_number: newOrderNumber,
          client_name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          address: `${formData.city}, ${formData.address}` + (formData.comment ? ` (${formData.comment})` : ''),
          total_amount: cartTotal + shippingCost,
          items: cart.map(item => ({
            product_id: item.product.id,
            name: item.product.name[locale],
            quantity: item.quantity,
            price: item.product.price,
            image: item.product.images?.[0] || ''
          }))
        })
      })

      // If token expired (401), fallback to guest checkout so order is not lost
      if (response.status === 401 && headers['Authorization']) {
        // If failed with 401, token might be invalid. Try without token.
        response = await fetch(apiUrl('/api/checkout/'), {
          method: 'POST',
          headers,
          body: JSON.stringify({
            order_number: newOrderNumber,
            client_name: `${formData.firstName} ${formData.lastName}`.trim(),
            phone: formData.phone,
            address: `${formData.city}, ${formData.address}` + (formData.comment ? ` (${formData.comment})` : ''),
            total_amount: cartTotal + shippingCost,
            items: cart.map(item => ({
              product_id: item.product.id,
              name: item.product.name[locale],
              quantity: item.quantity,
              price: item.product.price,
              image: item.product.images?.[0] || ''
            }))
          })
        })
      }

      if (response.ok) {
        setOrderNumber(newOrderNumber)
        setOrderPlaced(true)
        clearCart()
      } else {
        const errorData = await response.json()
        console.error("Backend error:", errorData)
        alert(locale === 'ru' ? 'Ошибка при оформлении заказа' : 'Buyurtma berishda xatolik')
      }
    } catch (error) {
      console.error("Network error:", error)
      alert(locale === 'ru' ? 'Ошибка сети' : 'Tarmoq xatosi')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (orderPlaced) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center py-16"
            >
              <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {t.checkout.orderSuccess}
              </h1>
              <p className="text-muted-foreground mb-4">
                {t.checkout.orderNumber}: <span className="font-mono font-semibold text-foreground">{orderNumber}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-8">
                {locale === 'ru' 
                  ? 'Мы свяжемся с вами в ближайшее время для подтверждения заказа' 
                  : "Buyurtmani tasdiqlash uchun tez orada siz bilan bog'lanamiz"}
              </p>
              <Link href="/catalog">
                <Button className="rounded-xl">
                  {t.cart.continueShopping}
                </Button>
              </Link>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (cart.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-24 pb-16 bg-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">{t.cart.empty}</p>
              <Link href="/catalog">
                <Button className="rounded-xl">{t.cart.continueShopping}</Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Back Button */}
          <Link href="/cart">
            <Button variant="ghost" className="mb-6 -ml-3">
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t.common.back}
            </Button>
          </Link>

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              {t.checkout.title}
            </h1>
          </motion.div>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-10 max-w-lg">
            {[
              { num: 1, label: t.checkout.personalInfo },
              { num: 2, label: t.checkout.deliveryInfo },
              { num: 3, label: t.checkout.paymentInfo },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center flex-1">
                <button
                  onClick={() => setStep(s.num)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all ${
                    step >= s.num
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {s.num}
                </button>
                {i < 2 && (
                  <div className={`flex-1 h-0.5 mx-2 ${
                    step > s.num ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-8">
              {/* Step 1: Personal Info */}
              {step >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl bg-card border border-border"
                >
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    {t.checkout.personalInfo}
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        {t.checkout.firstName} *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full h-12 px-4 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        {t.checkout.lastName} *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full h-12 px-4 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        {t.checkout.phone} *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+998"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full h-12 px-4 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        {t.checkout.email}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full h-12 px-4 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                  {step === 1 && (
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      className="mt-6 rounded-xl"
                    >
                      {t.common.next}
                    </Button>
                  )}
                </motion.div>
              )}

              {/* Step 2: Delivery */}
              {step >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl bg-card border border-border"
                >
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    {t.checkout.deliveryInfo}
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        {t.checkout.city} *
                      </label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full h-12 px-4 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        {t.checkout.address} *
                      </label>
                      <input
                        type="text"
                        name="address"
                        required
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full h-12 px-4 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        {t.checkout.comment}
                      </label>
                      <textarea
                        name="comment"
                        rows={3}
                        value={formData.comment}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                  {step === 2 && (
                    <Button
                      type="button"
                      onClick={() => setStep(3)}
                      className="mt-6 rounded-xl"
                    >
                      {t.common.next}
                    </Button>
                  )}
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {step >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl bg-card border border-border"
                >
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    {t.checkout.paymentMethod}
                  </h2>
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === 'cash'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        paymentMethod === 'cash' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                      }`}>
                        <Banknote className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-foreground">{t.checkout.cash}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === 'card'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        paymentMethod === 'card' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
                      }`}>
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-foreground">{t.checkout.card}</span>
                    </button>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-6 h-14 text-base rounded-xl neon-glow disabled:opacity-50"
                  >
                    {isSubmitting ? (locale === 'ru' ? 'Оформление...' : 'Rasmiylashtirilmoqda...') : t.checkout.placeOrder}
                  </Button>
                </motion.div>
              )}
            </form>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-28 p-6 rounded-2xl bg-card border border-border"
              >
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  {locale === 'ru' ? 'Ваш заказ' : 'Sizning buyurtmangiz'}
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-4 max-h-60 overflow-auto">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name[locale]}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {item.product.name[locale]}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} x {formatPrice(item.product.price, locale)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 py-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.cart.subtotal}</span>
                    <span className="text-foreground">{formatPrice(cartTotal, locale)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t.cart.shipping}</span>
                    <span className="text-foreground">
                      {shippingCost === 0 ? t.cart.free : formatPrice(shippingCost, locale)}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-border">
                  <span className="text-lg font-semibold text-foreground">{t.cart.total}</span>
                  <span className="text-lg font-bold text-foreground">
                    {formatPrice(cartTotal + shippingCost, locale)}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
