'use client'

import Link from 'next/link'
import { useStore } from '@/lib/store'
import { getTranslation } from '@/lib/i18n'
import { MapPin, Phone, Mail } from 'lucide-react'

export function Footer() {
  const { locale } = useStore()
  const t = getTranslation(locale)

  const catalogLinks = [
    { href: '/catalog?category=keyboards', label: t.categories.keyboards },
    { href: '/catalog?category=mice', label: t.categories.mice },
    { href: '/catalog?category=mousepads', label: t.categories.mousepads },
    { href: '/catalog?category=headsets', label: t.categories.headsets },
  ]

  const companyLinks = [
    { href: '/about', label: t.nav.about },
    { href: '/contacts', label: t.nav.contacts },
    { href: '/privacy', label: t.footer.privacy },
    { href: '/terms', label: t.footer.terms },
  ]

  const helpLinks = [
    { href: '/delivery', label: t.footer.delivery },
    { href: '/returns', label: t.footer.returns },
    { href: '/faq', label: t.footer.faq },
  ]

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold tracking-tight">
                <span className="text-foreground">KEY</span>
                <span className="text-primary">LLECT</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              {t.footer.description}
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{t.contacts.addressValue}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span>+998 77 166 33 23</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span>info@keyllect.uz</span>
              </div>
            </div>
          </div>

          {/* Catalog */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t.footer.catalog}</h4>
            <ul className="space-y-3">
              {catalogLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t.footer.company}</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{t.footer.help}</h4>
            <ul className="space-y-3">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; 2024 Keyllect. {t.footer.rights}.</p>
          <div className="flex items-center gap-6">
            <a href="https://t.me/keyllect" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Telegram
            </a>
            <a href="https://instagram.com/keyllect" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
