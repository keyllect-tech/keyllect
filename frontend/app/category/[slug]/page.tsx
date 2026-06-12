import CategoryClient from './CategoryClient'
import { apiUrl } from '@/lib/api'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const res = await fetch(apiUrl('/api/categories/'), { next: { revalidate: 60 } })
    if (res.ok) {
      const categories = await res.json()
      if (Array.isArray(categories) && categories.length > 0) {
        return categories.map((category: any) => ({
          slug: String(category.slug),
        }))
      }
    }
  } catch (error) {
    console.error('Failed to fetch categories for generateStaticParams:', error)
  }
  return [{ slug: 'keyboards' }, { slug: 'mice' }]
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  return <CategoryClient params={params} />
}

