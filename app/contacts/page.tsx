'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useStore } from '@/lib/store'
import { getTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/button'

export default function ContactsPage() {
  const { locale } = useStore()
  const t = getTranslation(locale)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const contactInfo = [
    {
      icon: MapPin,
      title: t.contacts.address,
      value: t.contacts.addressValue,
      link: 'https://maps.google.com/?q=Tashkent,Amir+Temur+Street,1',
    },
    {
      icon: Phone,
      title: t.contacts.phone,
      value: '+998 71 123 45 67',
      link: 'tel:+998711234567',
    },
    {
      icon: Mail,
      title: t.contacts.email,
      value: 'info@keyllect.uz',
      link: 'mailto:info@keyllect.uz',
    },
    {
      icon: Clock,
      title: t.contacts.workHours,
      value: t.contacts.workHoursValue,
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSubmitted(true)
    setTimeout(() => setFormSubmitted(false), 3000)
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {t.contacts.title}
            </h1>
            <p className="text-xl text-muted-foreground">
              {t.contacts.subtitle}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {contactInfo.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  {item.link ? (
                    <a
                      href={item.link}
                      target={item.link.startsWith('http') ? '_blank' : undefined}
                      rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{item.title}</p>
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {item.value}
                        </p>
                      </div>
                    </a>
                  ) : (
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{item.title}</p>
                        <p className="font-medium text-foreground">{item.value}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Social Links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-5 rounded-2xl bg-card border border-border"
              >
                <p className="text-sm text-muted-foreground mb-3">
                  {locale === 'ru' ? 'Мы в социальных сетях' : 'Biz ijtimoiy tarmoqlarda'}
                </p>
                <div className="flex gap-3">
                  <a
                    href="https://t.me/keyllect"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0088cc] text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Telegram
                  </a>
                  <a
                    href="https://instagram.com/keyllect"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Instagram
                  </a>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 lg:p-8 rounded-2xl bg-card border border-border"
            >
              <h2 className="text-xl font-semibold text-foreground mb-6">
                {t.contacts.sendMessage}
              </h2>

              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-foreground font-medium">
                    {locale === 'ru' ? 'Сообщение отправлено!' : 'Xabar yuborildi!'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {locale === 'ru' 
                      ? 'Мы свяжемся с вами в ближайшее время' 
                      : "Tez orada siz bilan bog'lanamiz"}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      {t.contacts.name} *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full h-12 px-4 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        {t.contacts.phone} *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+998"
                        className="w-full h-12 px-4 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">
                        {t.contacts.email}
                      </label>
                      <input
                        type="email"
                        className="w-full h-12 px-4 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      {t.contacts.message} *
                    </label>
                    <textarea
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl">
                    <Send className="w-4 h-4 mr-2" />
                    {t.contacts.send}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>

          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-16 rounded-2xl overflow-hidden border border-border"
          >
            <div className="aspect-[21/9] bg-card flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {locale === 'ru' ? 'Карта будет здесь' : "Xarita shu yerda bo'ladi"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t.contacts.addressValue}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
