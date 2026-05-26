import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/account/settings/'],
    },
    sitemap: 'https://keyllect.uz/sitemap.xml',
  }
}
