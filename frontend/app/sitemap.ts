import { MetadataRoute } from 'next'
import { categories, products } from '@/lib/data'
import { apiUrl } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://keyllect.uz'

  let rawCategories = [];
  let rawProducts = [];
  try {
    const [catRes, prodRes] = await Promise.all([
      fetch(apiUrl('/api/categories/'), { cache: 'no-store' }),
      fetch(apiUrl('/api/products/'), { cache: 'no-store' })
    ]);
    if (catRes.ok) rawCategories = await catRes.json();
    if (prodRes.ok) rawProducts = await prodRes.json();
  } catch (e) {}

  const categoryUrls = rawCategories.map((c: any) => ({
    url: `${baseUrl}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const productUrls = rawProducts.map((p: any) => ({
    url: `${baseUrl}/product/${p.id}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...categoryUrls,
    ...productUrls,
    {
      url: `${baseUrl}/contacts`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}
