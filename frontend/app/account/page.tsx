'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { User, Package, Settings, LogOut, Mail, Phone, MapPin } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useStore } from '@/lib/store'
import { apiUrl } from '@/lib/api'
import { getTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'

export default function AccountPage() {
  const { locale, user, setUser, logout } = useStore()
  const t = getTranslation(locale)
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile')
  const [isLoginMode, setIsLoginMode] = useState(true)
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const [orders, setOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (user?.token) {
      setOrdersLoading(true)
      fetch(apiUrl('/api/orders/my-orders/'), {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data)
        }
      })
      .catch(console.error)
      .finally(() => setOrdersLoading(false))
    }
  }, [user?.token])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isLoginMode ? '/api/auth/login/' : '/api/auth/register/'
      const res = await fetch(apiUrl(endpoint), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone, password })
      })
      const data = await res.json()
      if (res.ok) {
        setUser({ phone, token: data.access })
      } else {
        setError(data.error || 'Произошла ошибка')
      }
    } catch (err) {
      setError('Ошибка сети')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch(apiUrl('/api/auth/google/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      })
      const data = await res.json()
      if (res.ok) {
        setUser({ phone: data.phone, token: data.access })
      } else {
        setError(data.error || 'Ошибка входа через Google')
      }
    } catch (err) {
      setError('Ошибка сети')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { key: 'profile', label: t.account.profile, icon: User },
    { key: 'orders', label: t.account.orders, icon: Package },
    { key: 'settings', label: t.account.settings, icon: Settings },
  ]

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
              {t.account.title}
            </h1>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="p-4 rounded-2xl bg-card border border-border">
                {/* User Info */}
                <div className="flex items-center gap-4 pb-4 mb-4 border-b border-border">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {!mounted ? (locale === 'ru' ? 'Загрузка...' : 'Yuklanmoqda...') : (user ? user.phone : (locale === 'ru' ? 'Гость' : 'Mehmon'))}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {!mounted ? '...' : (user ? 'Online' : (locale === 'ru' ? 'Войдите в аккаунт' : 'Hisobga kiring'))}
                    </p>
                  </div>
                </div>

                {/* Tabs */}
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as typeof activeTab)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        activeTab === tab.key
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  ))}
                  {mounted && user && (
                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                      <LogOut className="w-5 h-5" />
                      {t.account.logout}
                    </button>
                  )}
                </nav>
              </div>
            </motion.aside>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-3"
            >
              {activeTab === 'profile' && (
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <h2 className="text-lg font-semibold text-foreground mb-6">
                    {t.account.profile}
                  </h2>
                  
                  {!mounted ? (
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-secondary rounded w-3/4"></div>
                      <div className="h-24 bg-secondary rounded-xl"></div>
                    </div>
                  ) : user ? (
                    <div className="space-y-4">
                      <p className="text-foreground">
                        {locale === 'ru' ? 'Добро пожаловать в личный кабинет.' : 'Shaxsiy kabinetga xush kelibsiz.'}
                      </p>
                      <div className="p-4 rounded-xl bg-secondary">
                        <p className="text-sm text-muted-foreground">Телефон</p>
                        <p className="font-medium text-foreground">{user.phone}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="max-w-md">
                      <p className="text-muted-foreground mb-6">
                        {locale === 'ru' 
                          ? 'Войдите или зарегистрируйтесь, чтобы отслеживать заказы и получать персональные предложения' 
                          : "Buyurtmalarni kuzatish va shaxsiy takliflar olish uchun kiring yoki ro'yxatdan o'ting"}
                      </p>
                      
                      <form onSubmit={handleAuth} className="space-y-4">
                        {error && <p className="text-destructive text-sm">{error}</p>}
                        <div>
                          <label className="block text-sm text-muted-foreground mb-2">
                            {locale === 'ru' ? 'Телефон' : 'Telefon'}
                          </label>
                          <input
                            type="text"
                            required
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            placeholder="+998 __ ___ __ __"
                            autoComplete="username"
                            className="w-full h-12 px-4 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-muted-foreground mb-2">
                            {locale === 'ru' ? 'Пароль' : 'Parol'}
                          </label>
                          <input
                            type="password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            autoComplete="current-password"
                            className="w-full h-12 px-4 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>
                        <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl">
                          {isLoginMode ? t.account.login : t.account.register}
                        </Button>
                        <Button type="button" onClick={() => setIsLoginMode(!isLoginMode)} variant="outline" className="w-full h-12 rounded-xl border-border">
                          {isLoginMode ? t.account.register : t.account.login}
                        </Button>
                      </form>

                      <div className="mt-6 flex items-center gap-4 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
                        <span className="text-xs text-muted-foreground uppercase">или</span>
                      </div>

                      <div className="mt-6 flex justify-center">
                        <GoogleOAuthProvider clientId="736910345295-lirablhkho160jjet5e83hnoiv5j56i6.apps.googleusercontent.com">
                          <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google Login Failed')}
                            theme="filled_black"
                            shape="pill"
                          />
                        </GoogleOAuthProvider>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <h2 className="text-lg font-semibold text-foreground mb-6">
                    {t.account.orders}
                  </h2>
                  
                  {ordersLoading ? (
                    <div className="text-center py-12 text-muted-foreground">Загрузка...</div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <div key={order.id} className="p-4 rounded-xl border border-border bg-secondary/50">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-foreground">Заказ #{order.order_number}</span>
                            <span className="text-sm text-primary">{new Date(order.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">Сумма:</span>
                            <span className="font-medium text-foreground">{Number(order.total_amount).toLocaleString()} сум</span>
                          </div>
                          <div className="flex justify-between items-center text-sm mt-1">
                            <span className="text-muted-foreground">Статус:</span>
                            <span className="text-foreground">{order.status === 'NEW' ? 'Новый' : order.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-4">{t.account.noOrders}</p>
                      <Link href="/catalog">
                        <Button variant="outline" className="rounded-xl border-border">
                          {t.cart.continueShopping}
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <h2 className="text-lg font-semibold text-foreground mb-6">
                    {t.account.settings}
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Saved Addresses */}
                    <div>
                      <h3 className="font-medium text-foreground mb-3">
                        {locale === 'ru' ? 'Сохранённые адреса' : 'Saqlangan manzillar'}
                      </h3>
                      
                      {ordersLoading ? (
                        <div className="text-sm text-muted-foreground py-2">Загрузка...</div>
                      ) : (() => {
                        const uniqueAddresses = Array.from(new Set(orders.map((o: any) => o.address).filter(Boolean)));
                        if (uniqueAddresses.length === 0) {
                          return (
                            <div className="p-4 rounded-xl bg-secondary flex items-center gap-3">
                              <MapPin className="w-5 h-5 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {locale === 'ru' ? 'Нет сохранённых адресов' : "Saqlangan manzillar yo'q"}
                              </span>
                            </div>
                          )
                        }
                        return (
                          <div className="space-y-3">
                            {uniqueAddresses.map((address, idx) => (
                              <div key={idx} className="p-4 rounded-xl bg-secondary flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-primary" />
                                <span className="text-sm text-foreground">
                                  {address as string}
                                </span>
                              </div>
                            ))}
                          </div>
                        )
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
