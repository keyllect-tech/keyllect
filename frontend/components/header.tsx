'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X,
  Globe
} from 'lucide-react'
import { useStore } from '@/lib/store'
import { getTranslation, type Locale } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function Header() {
  const router = useRouter()
  const { locale, setLocale, getCartCount, favorites } = useStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isSearchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setMobileMenuOpen(false)
      setSearchQuery('')
    }
  }
  const t = getTranslation(locale)
  const cartCount = getCartCount()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/catalog', label: t.nav.catalog },
    { href: '/about', label: t.nav.about },
    { href: '/contacts', label: t.nav.contacts },
  ]

  const toggleLocale = () => {
    setLocale(locale === 'ru' ? 'uz' : 'ru')
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'glass py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-2xl font-bold tracking-tight"
              >
                <span className="text-foreground">KEY</span>
                <span className="text-primary">LLECT</span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-2">
              {/* Search */}
              <AnimatePresence>
                {isSearchOpen ? (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 250, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    className="relative"
                  >
                    <form onSubmit={handleSearch}>
                      <input
                        type="text"
                        placeholder={t.nav.search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-10 pl-10 pr-4 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                        autoFocus
                      />
                      <button type="submit" aria-label="Submit search">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground cursor-pointer" />
                      </button>
                    </form>
                  </motion.div>
                ) : null}
              </AnimatePresence>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(!isSearchOpen)}
                className="text-muted-foreground hover:text-foreground"
                aria-label="Toggle search"
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </Button>

              {/* Language Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLocale}
                className="text-muted-foreground hover:text-foreground"
              >
                <Globe className="w-5 h-5" />
                <span className="sr-only">
                  {locale === 'ru' ? 'Switch to Uzbek' : 'Русский тилига ўтиш'}
                </span>
              </Button>

              {/* Favorites */}
              <Link href="/favorites" aria-label="Favorites">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground relative min-w-[44px] min-h-[44px]"
                  aria-label="Favorites"
                >
                  <Heart className="w-5 h-5" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[10px] font-bold rounded-full flex items-center justify-center text-primary-foreground">
                      {favorites.length}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Cart */}
              <Link href="/cart" aria-label="Cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground relative min-w-[44px] min-h-[44px]"
                  aria-label="Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[10px] font-bold rounded-full flex items-center justify-center text-primary-foreground">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Account */}
              <Link href="/account" aria-label="Account">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground min-w-[44px] min-h-[44px]"
                  aria-label="Account"
                >
                  <User className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Mobile Actions */}
            <div className="flex lg:hidden items-center gap-2">
              <Link href="/cart" aria-label="Cart">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground relative min-w-[44px] min-h-[44px]"
                  aria-label="Cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[10px] font-bold rounded-full flex items-center justify-center text-primary-foreground">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(true)}
                className="text-muted-foreground hover:text-foreground min-w-[44px] min-h-[44px]"
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[300px] bg-background border-l border-border z-50 p-6"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-lg font-semibold">Menu</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="min-w-[44px] min-h-[44px]"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Mobile Search */}
              <div className="relative mb-6">
                <form onSubmit={handleSearch}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.nav.search}
                    className="w-full h-12 pl-12 pr-4 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder:text-muted-foreground"
                  />
                  <button type="submit" aria-label="Submit search">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground cursor-pointer" />
                  </button>
                </form>
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex flex-col gap-2 mb-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-3 px-4 rounded-lg text-foreground hover:bg-secondary transition-colors font-medium"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Mobile Actions */}
              <div className="flex flex-col gap-2 border-t border-border pt-6">
                <Link
                  href="/favorites"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-secondary transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span>{t.nav.favorites}</span>
                  {favorites.length > 0 && (
                    <span className="ml-auto bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                      {favorites.length}
                    </span>
                  )}
                </Link>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-secondary transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>{t.nav.account}</span>
                </Link>
              </div>

              {/* Language Toggle */}
              <div className="mt-6 pt-6 border-t border-border">
                <button
                  onClick={toggleLocale}
                  className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-secondary transition-colors w-full"
                >
                  <Globe className="w-5 h-5" />
                  <span>{locale === 'ru' ? "O'zbek tili" : 'Русский язык'}</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
