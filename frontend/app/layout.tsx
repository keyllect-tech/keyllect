import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { ClientInit } from '@/components/client-init'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Купить игровые клавиатуры, мыши, наушники и коврики для ПК в Ташкенте | Keyllect',
    template: '%s | Keyllect — Игровая периферия в Ташкенте',
  },
  description: 'Купить механические клавиатуры, игровые мыши, наушники, коврики и аксессуары для ПК. Большой выбор продукции Logitech, Razer, HyperX, SteelSeries, Aula и других брендов. Доставка по Узбекистану.',
  keywords: [
    'купить клавиатуру', 'купить механическую клавиатуру', 'купить игровую мышь',
    'купить наушники', 'игровые наушники', 'аксессуары для ПК',
    'клавиатуры Ташкент', 'игровые мыши Ташкент', 'наушники Ташкент',
    'компьютерная периферия Узбекистан', 'механическая клавиатура', 'игровая мышь',
    'коврик для мыши', 'Logitech', 'Razer', 'HyperX', 'SteelSeries', 'Aula',
    'игровая периферия', 'геймерское оборудование', 'Keyllect',
  ],
  authors: [{ name: 'Keyllect' }],
  creator: 'Keyllect',
  publisher: 'Keyllect',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    alternateLocale: 'uz_UZ',
    url: 'https://keyllect.uz',
    siteName: 'Keyllect',
    title: 'Купить игровые клавиатуры, мыши, наушники и коврики в Ташкенте | Keyllect',
    description: 'Купить механические клавиатуры, игровые мыши, наушники, коврики и аксессуары для ПК. Большой выбор продукции Logitech, Razer, HyperX, SteelSeries. Доставка по Узбекистану.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Keyllect — Интернет-магазин игровой периферии в Ташкенте',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Купить игровые клавиатуры, мыши, наушники в Ташкенте | Keyllect',
    description: 'Механические клавиатуры, игровые мыши, наушники и аксессуары для ПК. Доставка по Узбекистану.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://keyllect.uz',
    languages: {
      'ru-RU': 'https://keyllect.uz',
      'uz-UZ': 'https://keyllect.uz/uz',
    },
  },
  metadataBase: new URL('https://keyllect.uz'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'YOUR_GOOGLE_VERIFICATION_CODE',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="bg-background" suppressHydrationWarning>
      <head>
        <script
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Store',
                name: 'Keyllect',
                description: 'Интернет-магазин игровой периферии в Ташкенте. Механические клавиатуры, игровые мыши, наушники и коврики.',
                url: 'https://keyllect.uz',
                logo: 'https://keyllect.uz/logo.png',
                image: 'https://keyllect.uz/og-image.jpg',
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: '2-й пр-д Кипчак 40/12',
                  addressLocality: 'Ташкент',
                  addressRegion: 'Ташкент',
                  addressCountry: 'UZ',
                },
                geo: {
                  '@type': 'GeoCoordinates',
                  latitude: 41.2995,
                  longitude: 69.2401,
                },
                contactPoint: {
                  '@type': 'ContactPoint',
                  telephone: '+998-77-166-33-23',
                  contactType: 'customer service',
                  availableLanguage: ['Russian', 'Uzbek'],
                },
                priceRange: '$$',
                openingHoursSpecification: {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
                  opens: '09:00',
                  closes: '21:00',
                },
                sameAs: [
                  'https://t.me/keyllect',
                  'https://instagram.com/keyllect',
                ],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'Keyllect',
                url: 'https://keyllect.uz',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: 'https://keyllect.uz/catalog?q={search_term_string}',
                  'query-input': 'required name=search_term_string',
                },
              },
            ]),
          }}
        />
      </head>
      <body suppressHydrationWarning className={`${inter.variable} font-sans antialiased overflow-x-hidden`}>
        <ClientInit />
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
