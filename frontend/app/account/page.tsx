'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { User, Package, Settings, LogOut, Mail, Phone, MapPin } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useStore } from '@/lib/store'
import { getTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'

export default function AccountPage() {
  const { locale } = useStore()
  const t = getTranslation(locale)
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile')

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
                      {locale === 'ru' ? 'Гость' : 'Mehmon'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {locale === 'ru' ? 'Войдите в аккаунт' : 'Hisobga kiring'}
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
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                    <LogOut className="w-5 h-5" />
                    {t.account.logout}
                  </button>
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
                  
                  {/* Login Form */}
                  <div className="max-w-md">
                    <p className="text-muted-foreground mb-6">
                      {locale === 'ru' 
                        ? 'Войдите или зарегистрируйтесь, чтобы отслеживать заказы и получать персональные предложения' 
                        : "Buyurtmalarni kuzatish va shaxsiy takliflar olish uchun kiring yoki ro'yxatdan o'ting"}
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-muted-foreground mb-2">
                          {locale === 'ru' ? 'Телефон или Email' : 'Telefon yoki Email'}
                        </label>
                        <input
                          type="text"
                          placeholder="+998 __ ___ __ __"
                          className="w-full h-12 px-4 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <Button className="w-full h-12 rounded-xl">
                        {t.account.login}
                      </Button>
                      <Button variant="outline" className="w-full h-12 rounded-xl border-border">
                        {t.account.register}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <h2 className="text-lg font-semibold text-foreground mb-6">
                    {t.account.orders}
                  </h2>
                  
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
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <h2 className="text-lg font-semibold text-foreground mb-6">
                    {t.account.settings}
                  </h2>
                  
                  <div className="space-y-6">
                    {/* Notification Settings */}
                    <div>
                      <h3 className="font-medium text-foreground mb-3">
                        {locale === 'ru' ? 'Уведомления' : 'Bildirishnomalar'}
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-4 rounded-xl bg-secondary cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Mail className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm text-foreground">
                              {locale === 'ru' ? 'Email уведомления' : 'Email bildirishnomalari'}
                            </span>
                          </div>
                          <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-primary" />
                        </label>
                        <label className="flex items-center justify-between p-4 rounded-xl bg-secondary cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5 text-muted-foreground" />
                            <span className="text-sm text-foreground">
                              {locale === 'ru' ? 'SMS уведомления' : 'SMS bildirishnomalari'}
                            </span>
                          </div>
                          <input type="checkbox" className="w-5 h-5 rounded accent-primary" />
                        </label>
                      </div>
                    </div>

                    {/* Saved Addresses */}
                    <div>
                      <h3 className="font-medium text-foreground mb-3">
                        {locale === 'ru' ? 'Сохранённые адреса' : 'Saqlangan manzillar'}
                      </h3>
                      <div className="p-4 rounded-xl bg-secondary flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {locale === 'ru' ? 'Нет сохранённых адресов' : "Saqlangan manzillar yo'q"}
                        </span>
                      </div>
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
