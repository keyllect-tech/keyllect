import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Keyllect — Премиальная игровая периферия',
    template: '%s | Keyllect',
  },
  description: 'Интернет-магазин премиальной компьютерной периферии. Механические клавиатуры, игровые мыши, наушники и аксессуары от Logitech, Razer, SteelSeries и других топ-брендов.',
  keywords: ['игровая периферия', 'клавиатуры', 'мыши', 'наушники', 'Logitech', 'Razer', 'SteelSeries', 'геймерское оборудование', 'Узбекистан'],
  authors: [{ name: 'Keyllect' }],
  creator: 'Keyllect',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    alternateLocale: 'uz_UZ',
    url: 'https://keyllect.uz',
    siteName: 'Keyllect',
    title: 'Keyllect — Премиальная игровая периферия',
    description: 'Интернет-магазин премиальной компьютерной периферии. Механические клавиатуры, игровые мыши, наушники и аксессуары.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Keyllect',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keyllect — Премиальная игровая периферия',
    description: 'Интернет-магазин премиальной компьютерной периферии.',
    images: ['/og-image.jpg'],
  },
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
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
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
    <html lang="ru" className="bg-background">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Store',
              name: 'Keyllect',
              description: 'Интернет-магазин премиальной компьютерной периферии',
              url: 'https://keyllect.uz',
              logo: 'https://keyllect.uz/logo.png',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'ул. Амира Темура, 1',
                addressLocality: 'Ташкент',
                addressCountry: 'UZ',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+998-71-123-45-67',
                contactType: 'customer service',
                availableLanguage: ['Russian', 'Uzbek'],
              },
              priceRange: '$$',
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
